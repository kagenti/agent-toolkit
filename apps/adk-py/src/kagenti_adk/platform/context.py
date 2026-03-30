# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0


from __future__ import annotations

import builtins
from typing import Literal
import pydantic
from pydantic import SerializeAsAny

from kagenti_adk.platform.client import PlatformClient, get_platform_client
from kagenti_adk.platform.common import PaginatedResult
from kagenti_adk.platform.provider import Provider
from kagenti_adk.platform.types import Metadata, MetadataPatch
from kagenti_adk.util.utils import filter_dict


class ContextToken(pydantic.BaseModel):
    context_id: str
    token: pydantic.Secret[str]
    expires_at: pydantic.AwareDatetime | None = None


class ContextPermissions(pydantic.BaseModel):
    files: set[Literal["read", "write", "extract", "*"]] = set()
    vector_stores: set[Literal["read", "write", "*"]] = set()
    context_data: set[Literal["read", "write", "*"]] = set()


class Permissions(ContextPermissions):
    llm: set[Literal["*"] | str] = set()
    embeddings: set[Literal["*"] | str] = set()
    a2a_proxy: set[Literal["*"] | str] = set()
    model_providers: set[Literal["read", "write", "*"]] = set()
    variables: SerializeAsAny[set[Literal["read", "write", "*"]]] = set()

    providers: set[Literal["read", "write", "*"]] = set()  # write includes "show logs" permission
    provider_variables: set[Literal["read", "write", "*"]] = set()

    contexts: set[Literal["read", "write", "*"]] = set()

    connectors: set[Literal["read", "write", "proxy", "*"]] = set()


class Context(pydantic.BaseModel):
    id: str
    created_at: pydantic.AwareDatetime
    updated_at: pydantic.AwareDatetime
    last_active_at: pydantic.AwareDatetime
    created_by: str
    provider_id: str | None = None
    metadata: Metadata | None = None

    @staticmethod
    async def create(
        *,
        metadata: Metadata | None = None,
        provider_id: str | None = None,
        client: PlatformClient | None = None,
    ) -> "Context":
        async with client or get_platform_client() as client:
            return pydantic.TypeAdapter(Context).validate_python(
                (
                    await client.post(
                        url="/api/v1/contexts",
                        json=filter_dict({"metadata": metadata, "provider_id": provider_id}),
                    )
                )
                .raise_for_status()
                .json()
            )

    @staticmethod
    async def list(
        *,
        client: PlatformClient | None = None,
        page_token: str | None = None,
        limit: int | None = None,
        order: Literal["asc"] | Literal["desc"] | None = None,
        order_by: Literal["created_at"] | Literal["updated_at"] | None = None,
        include_empty: bool = True,
        provider_id: str | None = None,
    ) -> PaginatedResult["Context"]:
        # `self` has a weird type so that you can call both `instance.get()` to update an instance, or `File.get("123")` to obtain a new instance
        async with client or get_platform_client() as client:
            return pydantic.TypeAdapter(PaginatedResult[Context]).validate_python(
                (
                    await client.get(
                        url="/api/v1/contexts",
                        params=filter_dict(
                            {
                                "page_token": page_token,
                                "limit": limit,
                                "order": order,
                                "order_by": order_by,
                                "include_empty": include_empty,
                                "provider_id": provider_id,
                            }
                        ),
                    )
                )
                .raise_for_status()
                .json()
            )

    async def get(
        self: "Context" | str,
        *,
        client: PlatformClient | None = None,
    ) -> "Context":
        # `self` has a weird type so that you can call both `instance.get()` to update an instance, or `File.get("123")` to obtain a new instance
        context_id = self if isinstance(self, str) else self.id
        async with client or get_platform_client() as client:
            return pydantic.TypeAdapter(Context).validate_python(
                (await client.get(url=f"/api/v1/contexts/{context_id}")).raise_for_status().json()
            )

    async def update(
        self: "Context" | str,
        *,
        metadata: Metadata | None,
        client: PlatformClient | None = None,
    ) -> "Context":
        # `self` has a weird type so that you can call both `instance.get()` to update an instance, or `File.get("123")` to obtain a new instance
        context_id = self if isinstance(self, str) else self.id
        async with client or get_platform_client() as client:
            result = pydantic.TypeAdapter(Context).validate_python(
                (await client.put(url=f"/api/v1/contexts/{context_id}", json={"metadata": metadata}))
                .raise_for_status()
                .json()
            )
        if isinstance(self, Context):
            self.__dict__.update(result.__dict__)
            return self
        return result

    async def patch_metadata(
        self: "Context" | str,
        *,
        metadata: MetadataPatch | None,
        client: PlatformClient | None = None,
    ) -> "Context":
        # `self` has a weird type so that you can call both `instance.get()` to update an instance, or `File.get("123")` to obtain a new instance
        context_id = self if isinstance(self, str) else self.id
        async with client or get_platform_client() as client:
            result = pydantic.TypeAdapter(Context).validate_python(
                (await client.patch(url=f"/api/v1/contexts/{context_id}/metadata", json={"metadata": metadata}))
                .raise_for_status()
                .json()
            )
        if isinstance(self, Context):
            self.__dict__.update(result.__dict__)
            return self
        return result

    async def delete(
        self: "Context" | str,
        *,
        client: PlatformClient | None = None,
    ) -> None:
        # `self` has a weird type so that you can call both `instance.delete()` or `File.delete("123")`
        context_id = self if isinstance(self, str) else self.id
        async with client or get_platform_client() as client:
            _ = (await client.delete(url=f"/api/v1/contexts/{context_id}")).raise_for_status()

    async def generate_token(
        self: "Context" | str,
        *,
        providers: builtins.list[str] | builtins.list[Provider] | None = None,
        client: PlatformClient | None = None,
        grant_global_permissions: Permissions | None = None,
        grant_context_permissions: ContextPermissions | None = None,
    ) -> ContextToken:
        """
        Generate token for agent authentication

        @param grant_global_permissions: Global permissions granted by the token. Must be subset of the users permissions
        @param grant_context_permissions: Context permissions granted by the token. Must be subset of the users permissions
        """
        # `self` has a weird type so that you can call both `instance.content()` to get content of an instance, or `File.content("123")`
        context_id = self if isinstance(self, str) else self.id
        grant_global_permissions = grant_global_permissions or Permissions()
        grant_context_permissions = grant_context_permissions or Permissions()

        if isinstance(self, Context) and self.metadata and (provider_id := self.metadata.get("provider_id", None)):
            providers = providers or [provider_id]

        if "*" not in grant_global_permissions.a2a_proxy and not grant_global_permissions.a2a_proxy:
            if not providers:
                raise ValueError(
                    "Invalid audience: You must specify providers or use '*' in grant_global_permissions.a2a_proxy."
                )

            grant_global_permissions.a2a_proxy |= {p.id if isinstance(p, Provider) else p for p in providers}

        async with client or get_platform_client() as client:
            token_response = (
                (
                    await client.post(
                        url=f"/api/v1/contexts/{context_id}/token",
                        json={
                            "grant_global_permissions": grant_global_permissions.model_dump(mode="json"),
                            "grant_context_permissions": grant_context_permissions.model_dump(mode="json"),
                        },
                    )
                )
                .raise_for_status()
                .json()
            )
        return pydantic.TypeAdapter(ContextToken).validate_python({**token_response, "context_id": context_id})
