# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from collections.abc import AsyncGenerator

import janus
from a2a.server.tasks import TaskStore
from a2a.types import (
    Artifact,
    Message,
    Task,
)
from pydantic import BaseModel, PrivateAttr

from kagenti_adk.a2a.types import RunYield, RunYieldResume


class RunContextSettings(BaseModel):
    strict: bool = False


class RunContext(BaseModel, arbitrary_types_allowed=True):
    task_id: str
    context_id: str
    current_task: Task | None = None
    related_tasks: list[Task] | None = None
    strict: bool = False  # TODO: explain strict mode - what yields will stop message etc. Use in match/case

    _task_store: TaskStore
    _yield_queue: janus.Queue[RunYield] = PrivateAttr(default_factory=janus.Queue)
    _yield_resume_queue: janus.Queue[RunYieldResume | Exception] = PrivateAttr(default_factory=janus.Queue)

    def __init__(self, _task_store: TaskStore, **data):
        super().__init__(**data)
        self._task_store = _task_store

    async def load_history(self) -> AsyncGenerator[Message | Artifact, None]:
        """Load conversation history from the A2A TaskStore.

        Yields messages and artifacts from the current task's history.
        """
        task = await self._task_store.get(self.task_id)
        if task:
            for msg in task.history:
                yield msg
            for artifact in task.artifacts:
                yield artifact

    def yield_sync(self, value: RunYield) -> RunYieldResume:
        self._yield_queue.sync_q.put(value)
        resp = self._yield_resume_queue.sync_q.get()
        if isinstance(resp, Exception):
            raise resp
        return resp

    async def yield_async(self, value: RunYield) -> RunYieldResume:
        await self._yield_queue.async_q.put(value)
        resp = await self._yield_resume_queue.async_q.get()
        if isinstance(resp, Exception):
            raise resp
        return resp

    def shutdown(self) -> None:
        self._yield_queue.shutdown()
        self._yield_resume_queue.shutdown()
