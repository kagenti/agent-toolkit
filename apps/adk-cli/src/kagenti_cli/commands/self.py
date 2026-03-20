# SPDX-License-Identifier: Apache-2.0
from __future__ import annotations

import functools
import importlib.metadata
import os
import platform
import shutil
import subprocess
import sys
import typing

import httpx
import packaging.version
import pydantic
import typer
from InquirerPy import inquirer

import kagenti_cli.commands.platform
from kagenti_cli.api import fetch_server_version
from kagenti_cli.async_typer import AsyncTyper
from kagenti_cli.commands.model import setup as model_setup
from kagenti_cli.configuration import Configuration
from kagenti_cli.console import console
from kagenti_cli.utils import run_command, verbosity

app = AsyncTyper()
configuration = Configuration()


@functools.cache
def _path() -> str:
    # These are PATHs where `uv` installs itself when installed through own install script
    # Package managers may install elsewhere, but that location should already be in PATH
    return os.pathsep.join(
        ([xdg_bin_home] if (xdg_bin_home := os.getenv("XDG_BIN_HOME")) else [])
        + ([os.path.realpath(f"{xdg_data_home}/../bin")] if (xdg_data_home := os.getenv("XDG_DATA_HOME")) else [])
        + [
            os.path.expanduser("~/.local/bin"),
            os.getenv("PATH", ""),
        ]
    )


@app.command("version")
async def version(
    verbose: typing.Annotated[bool, typer.Option("-v", "--verbose", help="Show verbose output")] = False,
):
    """Print version of the Kagenti ADK CLI."""
    with verbosity(verbose=verbose):
        cli_version = importlib.metadata.version("kagenti-cli")
        platform_version = await fetch_server_version()
        active_server = configuration.auth_manager.active_server

        latest_cli_version: str | None = None
        with console.status("Checking for newer version...", spinner="dots"):
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get("https://pypi.org/pypi/kagenti-cli/json")
                PyPIPackageInfo = typing.TypedDict("PyPIPackageInfo", {"version": str})
                PyPIPackage = typing.TypedDict("PyPIPackage", {"info": PyPIPackageInfo})
                if response.status_code == 200:
                    latest_cli_version = pydantic.TypeAdapter(PyPIPackage).validate_json(response.text)["info"][
                        "version"
                    ]

        console.print()
        console.print(f"       kagenti-adk version: [bold]{cli_version}[/bold]")
        console.print(
            f"  kagenti-platform version: [bold]{platform_version.replace('-', '') if platform_version is not None else 'not running'}[/bold]"
        )
        console.print(f"        kagenti-adk server: [bold]{active_server if active_server else 'none'}[/bold]")
        console.print()

        if latest_cli_version and packaging.version.parse(latest_cli_version) > packaging.version.parse(cli_version):
            console.hint(
                f"A newer version ([bold]{latest_cli_version}[/bold]) is available. Update using: [green]kagenti-adk self upgrade[/green]."
            )
        elif platform_version is None:
            console.hint("Start the Kagenti ADK platform using: [green]kagenti-adk platform start[/green]")
        elif platform_version.replace("-", "") != cli_version:
            console.hint("Update the Kagenti ADK platform using: [green]kagenti-adk platform start[/green]")
        else:
            console.success("Everything is up to date!")


@app.command("install")
async def install(
    verbose: typing.Annotated[bool, typer.Option("-v", "--verbose", help="Show verbose output")] = False,
    yes: typing.Annotated[bool, typer.Option("--yes", "-y", help="Skip confirmation prompts")] = False,
):
    """Install Kagenti ADK platform pre-requisites."""
    with verbosity(verbose=verbose):
        ready_to_start = False
        if platform.system() == "Linux":
            if shutil.which(
                f"qemu-system-{'aarch64' if platform.machine().lower() == 'arm64' else platform.machine().lower()}"
            ):
                ready_to_start = True
            else:
                if os.geteuid() != 0:
                    console.hint(
                        "You may be prompted for your password to install QEMU, as this needs root privileges."
                    )
                    os.execlp("sudo", sys.executable, *sys.argv)
                for cmd in [
                    ["apt", "install", "-y", "-qq", "qemu-system"],
                    ["dnf", "install", "-y", "-q", "@virtualization"],
                    ["pacman", "-S", "--noconfirm", "--noprogressbar", "qemu"],
                    ["zypper", "install", "-y", "-qq", "qemu"],
                    ["yum", "install", "-y", "-q", "qemu-kvm"],
                    ["emerge", "--quiet", "app-emulation/qemu"],
                ]:
                    if shutil.which(cmd[0]):
                        try:
                            await run_command(cmd, f"Installing QEMU with {cmd[0]}")
                            ready_to_start = True
                            break
                        except subprocess.CalledProcessError, FileNotFoundError:
                            console.warning(
                                "Failed to install QEMU automatically. Please install QEMU manually before using Kagenti ADK. Refer to https://www.qemu.org/download/ for instructions."
                            )
                            break
        elif platform.system() == "Darwin":
            ready_to_start = True

        already_started = False
        console.print()
        if ready_to_start and (
            yes
            or await inquirer.confirm(
                message="Do you want to start the Kagenti ADK platform now? Will run: kagenti-adk platform start",
                default=True,
            ).execute_async()
        ):
            try:
                await kagenti_cli.commands.platform.start_cmd(set_values_list=[], verbose=verbose)
                already_started = True
                console.print()
            except Exception:
                console.warning("Platform start failed. You can retry with [green]kagenti-adk platform start[/green].")

        already_configured = False
        if already_started and (
            yes
            or await inquirer.confirm(
                message="Do you want to configure your LLM provider now? Will run: kagenti-adk model setup",
                default=True,
            ).execute_async()
        ):
            try:
                await model_setup(verbose=verbose, yes=yes)
                already_configured = True
            except Exception:
                console.warning("Model setup failed. You can retry with [green]kagenti-adk model setup[/green].")

        if already_configured and (
            yes
            or await inquirer.confirm(
                message="Do you want to open the web UI now? Will run: kagenti-adk ui", default=True
            ).execute_async()
        ):
            import webbrowser

            webbrowser.open("http://adk.localtest.me:8080")

        console.print()
        console.success("Installation complete!")
        if not shutil.which("kagenti-adk", path=_path()):
            console.hint("Open a new terminal window to use the [green]kagenti-adk[/green] command.")
        if not already_started:
            console.hint("Start the Kagenti ADK platform using: [green]kagenti-adk platform start[/green]")
        if not already_configured:
            console.hint("Configure your LLM provider using: [green]kagenti-adk model setup[/green]")
        console.hint(
            "Use [green]kagenti-adk ui[/green] to open the web GUI, or [green]kagenti-adk run chat[/green] to talk to an agent on the command line."
        )
        console.hint(
            "Run [green]kagenti-adk --help[/green] to learn about available commands, or check the documentation at https://agentstack.beeai.dev/"
        )


@app.command("upgrade")
async def upgrade(
    verbose: typing.Annotated[bool, typer.Option("-v", "--verbose", help="Show verbose output")] = False,
):
    """Upgrade Kagenti ADK CLI and Platform to the latest version."""
    if not shutil.which("uv", path=_path()):
        console.error("Can't self-upgrade because 'uv' was not found.")
        raise typer.Exit(1)

    with verbosity(verbose=verbose):
        await run_command(
            ["uv", "tool", "install", "--force", "kagenti-cli"],
            "Upgrading kagenti-cli",
            env={"PATH": _path()},
        )
        await kagenti_cli.commands.platform.start_cmd(set_values_list=[], verbose=verbose)
        await version(verbose=verbose)


@app.command("uninstall")
async def uninstall(
    verbose: typing.Annotated[bool, typer.Option("-v", "--verbose", help="Show verbose output")] = False,
):
    """Uninstall Kagenti ADK CLI and Platform."""
    if not shutil.which("uv", path=_path()):
        console.error("Can't self-uninstall because 'uv' was not found.")
        raise typer.Exit(1)

    with verbosity(verbose=verbose):
        await kagenti_cli.commands.platform.delete_cmd(verbose=verbose)
        await run_command(
            ["uv", "tool", "uninstall", "kagenti-cli"],
            "Uninstalling kagenti-cli",
            env={"PATH": _path()},
        )
        console.success("Kagenti ADK uninstalled successfully.")
