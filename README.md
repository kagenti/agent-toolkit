# Kagenti ADK

**The developer toolkit for getting agents into production.**

[![GitHub Release](https://img.shields.io/github/v/release/kagenti/adk)](https://github.com/kagenti/adk/releases/latest)
[![License](https://img.shields.io/github/license/kagenti/adk)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/aJ92dNDzqB)

[Documentation](https://kagenti.github.io/adk) · [Discord](https://discord.gg/aJ92dNDzqB) · [Contributing](./CONTRIBUTING.md)

---

Kagenti ADK (Agent Development Kit) takes agents built with any framework or custom code and turns them into A2A-compliant services.

> [!WARNING]
> This project is under active development and not yet ready for production use.

## What's in the kit

| Component | Description |
|---|---|
| **CLI** | Scaffold projects, run agents locally, and deploy |
| **Python SDK** | Wrap your agent with A2A, inject runtime services via dependency injection |
| **TypeScript Client SDK** | Build applications that talk to your agents |
| **Server** | Self-hostable runtime with everything below built in |

### Runtime services

| Service | What it does |
|---|---|
| **LLM proxy** | Single API for 15+ providers — OpenAI, Anthropic, watsonx.ai, Bedrock, Ollama |
| **MCP connectors** | Connect agents to external tools via [Model Context Protocol](https://modelcontextprotocol.io/) |
| **PostgreSQL** | Agent state, conversation history, and configuration |
| **Vector search** | pgvector for embeddings and similarity search |
| **File storage** | S3-compatible upload/download via SeaweedFS |
| **Document extraction** | Text extraction from PDFs, CSVs, and more via Docling |
| **Authentication** | Identity and access management via Keycloak |
| **Observability** | LLM tracing and agent debugging via Phoenix |
| **Web UI** | Built-in chat interface for testing your agents |

## Quick start

```bash
sh -c "$(curl -LsSf https://raw.githubusercontent.com/kagenti/adk/main/install.sh)"
```

## Get involved

We'd love to hear from you — whether you have questions, feedback, or want to contribute.

| | |
|---|---|
| **Discord** | [Join the community](https://discord.gg/aJ92dNDzqB) |
| **Email** | kagenti-maintainers@googlegroups.com |
| **Contributing** | [Read the guide](./CONTRIBUTING.md) |
| **Issues** | [Report a bug or request a feature](https://github.com/kagenti/adk/issues) |

## License

[Apache 2.0](./LICENSE)
