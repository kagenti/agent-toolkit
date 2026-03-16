# Kagenti Agent Development Kit

[![GitHub Release](https://img.shields.io/github/v/release/kagenti/adk)](https://github.com/kagenti/adk/releases/latest)
[![License](https://img.shields.io/github/license/kagenti/adk)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/aJ92dNDzqB)

> 🚧 This project is under active development and not yet ready for use.

---

## What is Kagenti ADK?

Kagenti ADK (Agent Development Kit) takes agents built with any framework or custom code and turns them into [A2A](https://a2a-protocol.org/)-compliant services.

It provides:

- A **Python SDK** to expose your agent over A2A and connect it to the runtime services below
- A **TypeScript client SDK** to build applications that talk to your agents
- A **CLI** to scaffold projects, run agents, and deploy
- A **server** with built-in runtime services your agents use:
  - **LLM proxy** — single API for 15+ providers (OpenAI, Anthropic, watsonx.ai, Bedrock, Ollama, and more)
  - **MCP connectors** — connect agents to external tools and APIs via the [Model Context Protocol](https://modelcontextprotocol.io/)
  - **Database (PostgreSQL)** — agent state, conversation history, and configuration
  - **Vector search (pgvector)** — embeddings and similarity search for RAG workflows
  - **File storage (SeaweedFS)** — S3-compatible upload, download, and storage
  - **Document extraction (Docling)** — text extraction from PDFs, CSVs, and other formats
  - **Authentication (Keycloak)** — identity and access management
  - **Observability (Phoenix)** — LLM tracing and agent debugging
  - **End user web UI** — chat interface for interacting with your agents

## Status

This project is under active development. Documentation, packages, and an initial release are coming soon.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Contact

To reach the maintainer team, email **kagenti-maintainers@googlegroups.com** or join us on [Discord](https://discord.gg/aJ92dNDzqB).

## License

[Apache 2.0](./LICENSE)

## QR Code for Kagenti.io

This QR Code links to <http://kagenti.io>

![Kagenti.io QR Code](./docs/stable/images/Kagenti.QRcode.png)
