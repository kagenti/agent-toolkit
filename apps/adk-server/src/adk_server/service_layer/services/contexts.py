# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import logging
from contextlib import suppress
from datetime import timedelta
from uuid import UUID

from fastapi import status
from kink import inject
from pydantic import TypeAdapter

from adk_server.api.schema.common import PaginationQuery
from adk_server.configuration import Configuration
from adk_server.domain.models.common import Metadata, MetadataPatch, PaginatedResult
from adk_server.domain.models.context import Context
from adk_server.domain.models.user import User
from adk_server.domain.repositories.file import IObjectStorageRepository
from adk_server.exceptions import EntityNotFoundError, PlatformError
from adk_server.service_layer.unit_of_work import IUnitOfWorkFactory
from adk_server.utils.utils import filter_dict, utc_now

logger = logging.getLogger(__name__)


@inject
class ContextService:
    def __init__(
        self,
        uow: IUnitOfWorkFactory,
        configuration: Configuration,
        object_storage: IObjectStorageRepository,
    ):
        self._uow = uow
        self._object_storage = object_storage
        self._configuration = configuration
        self._expire_resources_after = timedelta(days=configuration.context.resources_expire_after_days)

    async def create(self, *, user: User, metadata: Metadata, provider_id: UUID | None = None) -> Context:
        context = Context(created_by=user.id, metadata=metadata, provider_id=provider_id)
        async with self._uow() as uow:
            await uow.contexts.create(context=context)
            await uow.commit()
            return context

    async def get(self, *, context_id: UUID, user: User) -> Context:
        async with self._uow() as uow:
            return await uow.contexts.get(context_id=context_id, user_id=user.id)

    async def list(
        self, *, user: User, pagination: PaginationQuery, include_empty: bool = True, provider_id: UUID | None = None
    ) -> PaginatedResult[Context]:
        async with self._uow() as uow:
            return await uow.contexts.list_paginated(
                user_id=user.id,
                provider_id=provider_id,
                limit=pagination.limit,
                page_token=pagination.page_token,
                order=pagination.order,
                order_by=pagination.order_by,
                include_empty=include_empty,
            )

    async def update(self, *, context_id: UUID, metadata: Metadata | None, user: User) -> Context:
        async with self._uow() as uow:
            context = await uow.contexts.get(context_id=context_id, user_id=user.id)
            context.metadata = metadata
            context.updated_at = utc_now()
            await uow.contexts.update(context=context)
            await uow.commit()
        return context

    async def patch_metadata(self, *, context_id: UUID, metadata_patch: MetadataPatch, user: User) -> Context:
        async with self._uow() as uow:
            context = await uow.contexts.get(context_id=context_id, user_id=user.id)
            deleted_keys = {k for k, v in metadata_patch.items() if v is None}
            try:
                context.metadata = TypeAdapter(Metadata).validate_python(
                    {
                        **{k: v for k, v in (context.metadata or {}).items() if k not in deleted_keys},
                        **filter_dict(metadata_patch),
                    }
                )
            except ValueError as e:  # maximum number of keys exceeded
                raise PlatformError(str(e), status_code=status.HTTP_400_BAD_REQUEST) from e
            context.updated_at = utc_now()
            await uow.contexts.update(context=context)
            await uow.commit()
        return context

    async def delete(self, *, context_id: UUID, user: User) -> None:
        """Delete context and all attached resources"""
        async with self._uow() as uow:
            await uow.contexts.get(context_id=context_id, user_id=user.id)

            # Files
            file_ids = [file.id async for file in uow.files.list(user_id=user.id, context_id=context_id)]
            # File DB objects are deleted automatically using cascade

            # Vector stores
            # deleted automatically using cascade

            await uow.contexts.delete(context_id=context_id, user_id=user.id)
            await uow.commit()

        # TODO: a cronjob should sweep the files if the deletion fails here
        await self._object_storage.delete_files(file_ids=file_ids)

    async def expire_resources(self) -> dict[str, int]:
        if self._expire_resources_after <= timedelta(0):
            return {"files": 0, "vector_stores": 0}

        deleted_stats = {"files": 0, "vector_stores": 0}
        page_token = None
        has_more = True

        while has_more:
            file_ids = []
            async with self._uow() as uow:
                # TODO: mark contexts as cleaned up to filter them out in next cleanup
                page = await uow.contexts.list_paginated(
                    last_active_before=utc_now() - self._expire_resources_after,
                    page_token=page_token,
                    limit=100,
                )
                for context in page.items:
                    # Files
                    file_ids.extend([file.id async for file in uow.files.list(context_id=context.id)])
                    with suppress(EntityNotFoundError):
                        deleted_stats["files"] += await uow.files.delete(context_id=context.id)

                    # Vector stores
                    with suppress(EntityNotFoundError):
                        deleted_stats["vector_stores"] += await uow.vector_stores.delete(context_id=context.id)
                await uow.commit()

            page_token = page.next_page_token
            has_more = page.has_more

            # TODO: a cronjob should sweep the files if the deletion fails here
            await self._object_storage.delete_files(file_ids=file_ids)

        return deleted_stats

    async def update_last_active(self, *, context_id: UUID) -> None:
        async with self._uow() as uow:
            await uow.contexts.update_last_active(context_id=context_id)
            await uow.commit()

