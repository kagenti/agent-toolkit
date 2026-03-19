---
trigger: always_on
description: "Project-specific guidelines and instructions for the Kagenti ADK monorepo"
---

# Kagenti ADK Project Guidelines

This document contains critical instructions for working with the Kagenti ADK monorepo.

## 1. Architecture Overview

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

## 2. Project Structure & Task Runner

- **Monorepo**: This is a monorepo containing multiple projects (apps, agents, generic packages).
- **Task Runner**: We use [mise](https://mise.jdx.dev) as the task runner.
- **Python**: Each Python project has its own `.venv`. Always execute commands like `pytest` within the specific project directory using `uv run`.

## 3. Development Environment ("Dev Mode")

The "dev mode" stack is complex, utilizing **Lima** (VM), **Kubernetes**, and **Telepresence**.

- **Startup**: It takes ~10 minutes to start (`mise run adk-server:dev:start`).
- **Your Role**: **Do not attempt to start the stack yourself.** Ask the developer to ensure it is running if you need it.
- **Verification**: Run `curl localhost:8333/healthcheck` to see if the stack is up.
- **Database Access**: `agentstack-user:password@postgresql:5432/agentstack` (only available in dev mode).

## 4. Testing Strategies

### adk-server

- **Dependencies**: Relies heavily on the full "dev mode" stack (infrastructure + server).
- **E2E/Integration Tests**:
  - **Never** run these via `mise`.
  - Run specific tests using `pytest` (e.g., `uv run pytest -k 'test_name'`) only _after_ verifying the stack is running.
  - Do not try to run the full suite; it takes too long.
- **Unit/Dependency Checks**: You can use `uv run pytest` to check imports or specific logic that doesn't require the full stack.

### adk-py

- **Independence**: Tests are completely independent of the dev stack/infrastructure.
- **Execution**: Run freely using `uv run pytest` from the `apps/adk-py` directory.

## 5. Database Migrations

- **Stack**: SQLAlchemy Core + Alembic.
- **Workflow**:
  1. **Generate**: `mise run adk-server:migrations:generate` (must be in dev mode). **Never write migrations from scratch.**
  2. **Modify**: specific migration files after generation if needed.
  3. **Execute**: `mise run adk-server:migrations:run` (in dev mode).

## 6. Helm Chart Development

- **Templating**: Always use `--set encryptionKey="dummy"` when running `helm template` to avoid intentional failures.

## 7. General Best Practices

- **Commands**: Construct commands relative to the project root or verify `cwd` before running.
- **Verification**: If unsure about environment state, check `/healthcheck` or ask the user.
- **Docs**: You can read and modify documentation in the `docs/development` folder to get more information
