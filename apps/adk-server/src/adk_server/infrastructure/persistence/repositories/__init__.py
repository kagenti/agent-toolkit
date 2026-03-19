# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def import_repositories():
    """Import all repositories to make sure they are registered into sqlalchemy metadata"""
    import importlib
    import pkgutil

    for _, name, _ in pkgutil.walk_packages(__path__):
        importlib.import_module(f"{__name__}.{name}")
        logger.debug(f"Discovered repository: {__name__}.{name}")


import_repositories()
