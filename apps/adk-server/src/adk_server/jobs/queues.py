# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from enum import StrEnum


class Queues(StrEnum):
    # cron jobs
    CRON_CLEANUP = "cron:cleanup"
    CRON_PROVIDER = "cron:provider"
    CRON_MODEL_PROVIDER = "cron:model_provider"
    CRON_CONNECTOR = "cron:connector"
    # tasks
    TEXT_EXTRACTION = "text_extraction"
    TOOLKIT_DELETION = "toolkit_deletion"

    @staticmethod
    def all() -> set[str]:
        return {v.value for v in Queues.__members__.values()}
