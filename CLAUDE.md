# Kagenti ADK

## GitHub Operations

Use `gh` command for GitHub operations.

Repo: `kagenti/adk`

All commits must be signed off for DCO compliance (`git commit --signoff`).

## Useful scripts

- `mise run adk-server:migrations:run` run migrations

## Development rules

- When working in adk-server make sure you always test the behaviour using the adk-server debugging approach
- All testing and linting can be done via `mise run check`
- Formatting can be fixed via `mise run fix`

## Code Style

- Python 3.11+, `ruff` for linting and formatting
- Line length: 120
- Git hooks installed via `mise run common:setup:git-hooks`
