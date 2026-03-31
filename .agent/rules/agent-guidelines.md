# Kagenti ADK Project Guidelines

Decision tables and commands for common tasks.

- **Project structure** → Section 1
- **Environment setup** → Section 2
- **Testing** → Section 3
- **Architecture context** → Section 6

## 1. Project Structure & Task Runner

- **Monorepo**: This is a monorepo containing multiple projects (apps, agents, generic packages).
- **Task Runner**: We use [mise](https://mise.jdx.dev) as the task runner.
- **Python**: Each Python project has its own `.venv`. Always execute commands like `pytest` within the specific project directory using `uv run`.

## 2. Development Environment

### What Do I Need?

| You're working on... | Tier | Command |
|---|---|---|
| adk-py, linting, formatting, helm | 0 | Just run tests/checks directly |
| adk-server unit tests | 0 | `mise run adk-server:test:unit` |
| adk-server code (debugging/testing) | 2 | `mise run dev:ensure` |
| adk-ui development | 3 | `mise run dev:ensure --with-ui` |
| Database migrations | 2 | `mise run dev:ensure`, then `mise run adk-server:migrations:generate` |
| Auth-enabled testing | 2 | `mise run dev:ensure --set auth.enabled=true` |

`dev:ensure` is **idempotent** — run it as often as you need. It checks what's already running and only starts what's missing. It delegates to `adk-server:dev:start` for bootstrapping the platform.

Extra CLI args are passed through to `adk-server:dev:start` → `adk:start`, e.g. `mise run dev:ensure --set auth.enabled=true`.

### Starting the Dev Environment

If the user doesn't specify what they need, ask about these options before running `dev:ensure`:

- **UI dev server?** (`--with-ui`)
- **Auth enabled?** (`--set auth.enabled=true`)
- **Static UI disabled?** (`--set ui.enabled=false`)

### Environment Tiers

| Tier | Name | What's Running | Used For |
|------|------|---------------|----------|
| 0 | `none` | Nothing | adk-py work, adk-server unit tests, linting, formatting, helm checks |
| 1 | `cluster` | Lima VM + MicroShift + platform (incl. static UI) | Base infrastructure — prerequisite for tiers 2+ |
| 2 | `dev` | Tier 1 + telepresence + local server on :18333 | Server development, debugging, running individual tests via `uv run pytest` |
| 3 | `dev-ui` | Tier 2 + local UI dev server on localhost:3000 (hot-reload) | Active UI development |

### `.env` Configuration

The server reads configuration from `apps/adk-server/.env`.

- If `.env` doesn't exist, copy from `apps/adk-server/template.env`.
- **For development**: template defaults work as-is.
- **For running tests** against the dev cluster:
  - Add `DB_URL=postgresql+asyncpg://adk-user:password@localhost:5432/adk` (tests connect directly, not through telepresence).
  - Uncomment auth settings at the bottom of `template.env` if testing with auth enabled.
- **Never overwrite** a `.env` file without reading it first — it may contain the developer's custom values.

### Checking Environment Status

- `mise run dev:status` — shows what's running (cluster, telepresence, server, ports, UI).
- `curl localhost:18333/healthcheck` — quick check if the local server is responding.

### Dev Lifecycle Commands

| Command | What it does |
|---|---|
| `mise run dev:ensure` | Start dev environment (idempotent). Includes static UI in cluster. Delegates to `adk-server:dev:start` if platform not running. |
| `mise run dev:ensure --with-ui` | Same + local UI dev server with hot-reload on :3000. |
| `mise run dev:ensure --set ui.enabled=false` | Start without static UI in cluster. |
| `mise run dev:ensure --set auth.enabled=true` | Start with authentication enabled. |
| `mise run dev:stop` | Kill local processes (server, UI, port-forwards) + stop telepresence and VM. |
| `mise run dev:status` | Show what's running. |

Extra CLI args after `dev:ensure` are passed through to `adk-server:dev:start` → `adk:start`. Multiple `--set` flags can be combined.

### Safety Rules

- `mise run dev:ensure` is **safe to run at any time** — it's idempotent.
- `dev:stop` stops everything including the VM. Use it when done developing.
- **Never** run `adk:delete` or `adk-server:dev:delete` without asking the developer. These destroy the VM, which takes longer to recreate.

## 3. Testing Strategies

### adk-server

Tests use pytest markers to separate infrastructure requirements:

| Marker | Command | Infrastructure needed |
|---|---|---|
| `unit` | `uv run pytest -m unit` | None |
| `integration` | `uv run pytest -m integration` | Postgres (+ Redis for some). Run `mise run dev:ensure` first. |
| `e2e` | `uv run pytest -m e2e` | Full stack (Postgres, Keycloak, LLM, K8s). Run `mise run dev:ensure` first. |

- **Always use a marker** — running `uv run pytest` without `-m` hits all tests, including integration/e2e fixtures that fail on missing connections.
- **Integration/E2E**: Run specific tests (e.g., `uv run pytest -m integration -k 'test_name'`), not the full suite; it takes too long.
- **Connection errors at fixture setup** (e.g., "cannot connect to postgresql") mean the infrastructure isn't running — run `mise run dev:ensure`, don't chase code bugs.

### adk-py

- **Independence**: Tests are completely independent of the dev stack/infrastructure.
- **Execution**: Run freely using `uv run pytest` from the `apps/adk-py` directory.

## 4. Database Migrations

- **Stack**: SQLAlchemy Core + Alembic.
- **Workflow**:
  1. **Generate**: `mise run adk-server:migrations:generate` (must be in dev mode). **Never write migrations from scratch.**
  2. **Modify**: specific migration files after generation if needed.
  3. **Execute**: `mise run adk-server:migrations:run` (in dev mode).

## 5. Helm Chart Development

- **Templating**: Always use `--set encryptionKey="dummy"` when running `helm template` to avoid intentional failures.

## 6. Architecture Overview

The platform consists of multiple K8s microservices:

### Kagenti ADK server (`adk-server`)

- **Core Orchestrator**: Manages APIs for agents, files, vector stores, and permissions (Context Service/JWT).
- **Cluster Management**: Uses `kr8s` client to create K8s objects (deployments, services, secrets, build jobs, MCP servers).
- **Infrastructure Integrations**:
  - **Postgres**: Relational DB, Vector Store (pgvector), Task Queue (procrastinate), Secret Store (encrypted).
  - **SeaweedFS**: S3-compatible storage.
  - **Docling**: Text extraction service.
  - **Redis**: Optional caching.
- **Gateways**:
  - **Model Gateway**: Proxies OpenAI API.
  - **Agent Gateway**: Exposes A2A (Agent-to-Agent) API which proxies communication to agents. All communication to agents must go through this proxy.
- **Background Workers**: Uses procrastinate package to manage background workers and crons in postgresql.
- **Permission System**: We use role-based permissions with caveats, this is described in detail in `docs/development/custom-ui/permissions-and-tokens.mdx`

### Kagenti ADK UI (`adk-ui`)

- JavaScript frontend communicating with `adk-server`.
- **Development**: Runs locally on `localhost:3000` or inside the cluster.

### Kagenti ADK (`adk-py`)

- Python library for agents to interact with the server API.

### Infrastructure & Observability

- **Agents**: Managed by Kubernetes (scale 0-1).
- **Observability**: Otel-collector pushing traces to Arize Phoenix.
- **Auth**: Supports multiple configurations, read `docs/development/deployment-guide.mdx` if necessary.

## 7. General Best Practices

- **Commands**: Construct commands relative to the project root or verify `cwd` before running.
- **Verification**: If unsure about environment state, check `/healthcheck` or ask the user.
- **Docs**: You can read and modify documentation in the `docs/development` folder to get more information
