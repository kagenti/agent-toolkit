# Contributing to Agent Toolkit

We are grateful for your interest in joining the Kagenti community and making
a positive impact. Whether you're raising issues, enhancing documentation,
fixing bugs, or developing new features, your contributions are essential to
our success.

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kagenti/agent-toolkit.git
   cd agent-toolkit
   ```

2. Install pre-commit hooks:

   ```bash
   pip install pre-commit
   make install-hooks
   ```

3. Run linting:

   ```bash
   make lint
   ```

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with tests
4. Run pre-commit hooks: `pre-commit run --all-files`
5. Submit a pull request

Smaller pull requests are typically easier to review and merge. If your pull
request is large, collaborate with the maintainers to find the best way to
divide it.

## Commit Messages

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `test:` Adding or updating tests

## Certificate of Origin

All commits **must** include a `Signed-off-by` trailer (Developer Certificate
of Origin). Use the `-s` flag when committing:

```bash
git commit -s -m "feat: add new feature"
```

By contributing to this project you agree to the
[Developer Certificate of Origin](https://developercertificate.org/) (DCO).

## Licensing

Agent Toolkit is [Apache 2.0 licensed](LICENSE) and we accept contributions
via GitHub pull requests.
