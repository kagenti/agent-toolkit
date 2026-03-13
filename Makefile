.PHONY: lint fmt install-hooks

lint:
	pre-commit run --all-files

fmt:
	ruff format .
	ruff check --fix .

install-hooks:
	pre-commit install --hook-type pre-commit --hook-type commit-msg
