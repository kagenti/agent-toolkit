# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

"""create pgvector extension and vector schema

Revision ID: e8887469b03f
Revises: 1d33f70642f8
Create Date: 2026-03-16 15:50:59.306498

"""

from collections.abc import Sequence

from alembic import op

from adk_server import get_configuration

# revision identifiers, used by Alembic.
revision: str = "e8887469b03f"
down_revision: str | None = "1d33f70642f8"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create pgvector extension
    # This will fail if the user is not a superuser and the extension does not exist yet
    # It will pass if the extension already exists
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    # Create separate schema
    op.execute(f"CREATE SCHEMA IF NOT EXISTS {get_configuration().persistence.vector_db_schema}")


def downgrade() -> None:
    """Downgrade schema."""
    # Drop vector_db schema
    op.execute(f"DROP SCHEMA IF EXISTS {get_configuration().persistence.vector_db_schema} CASCADE")
