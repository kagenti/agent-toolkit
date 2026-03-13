# Agent Toolkit

## Overview

Kagenti Agent Toolkit — utilities and libraries for building AI agents on the Kagenti platform.

## Repository Structure

```
agent-toolkit/
├── pyproject.toml          # Python project config + ruff settings
├── Makefile                # lint, fmt, install-hooks targets
├── .pre-commit-config.yaml # Pre-commit hooks
└── .claude/                # Claude Code settings
```

## Key Commands

| Task | Command |
|------|---------|
| Lint | `make lint` |
| Format | `make fmt` |
| Install hooks | `make install-hooks` |

## Code Style

- Python 3.11+, `ruff` for linting and formatting
- Line length: 120
- Pre-commit hooks: `pre-commit install`

## DCO Sign-Off (Mandatory)

All commits must include a `Signed-off-by` trailer:

```sh
git commit -s -m "feat: add new feature"
```

## Commit Attribution

Use `Assisted-By` for AI attribution, never `Co-Authored-By`:

    Assisted-By: Claude (Anthropic AI) <noreply@anthropic.com>
