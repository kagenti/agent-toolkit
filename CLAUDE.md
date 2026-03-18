# Agent Stack

## GitHub Operations

Use `gh` command for GitHub operations.

Repo: `i-am-bee/agentstack`

All commits must be signed off for DCO compliance (`git commit --signoff`).

## Useful scripts
- `mise run adk-server:migrations:run` run migrations

## Development rules

- When working in adk-server make sure you always test the behaviour using the adk-server debugging approach
- All testing and linting can be done via `mise run check`
- Formatting can be fixed via `mise run fix`