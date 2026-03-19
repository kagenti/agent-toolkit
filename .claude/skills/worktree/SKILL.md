---
name: worktree
description: Work on features in isolated git worktrees backed by a dedicated Lima/MicroShift VM. Use only when invoked explicitly.
---

This skill sets up an isolated development environment: a git worktree under `.worktrees/` backed by a dedicated Lima VM with the worktree mounted at the same path as on the host. All commands targeting the feature run inside the VM via `limactl shell`.

## Creating the worktree and VM

Derive names first:

- **preliminary PR title** from the task description using "conventional commits" notation, e.g. `feat(cli): add worktree support`
- **branch name**:
   - Get committer name: `git config user.name`, slugify, e.g. "Jan Pokorný" → `janpokorny`
   - Slugify the PR title, e.g. `feat-cli-add-worktree-support`
   - Full branch: `<user-slug>/<title-slug>`, e.g. `janpokorny/feat-cli-add-worktree-support`
- **VM name**: `c-<title-slug>`, e.g. `c-feat-cli-add-worktree-support`.

```bash
git fetch origin main
git worktree add -b <branch> .worktrees/<branch> origin/main
mise run microshift-vm:build:qemu
cp -r apps/microshift-vm/dist .worktrees/<branch>/apps/microshift-vm/dist
limactl create --name <vm-name> --mount-only=.worktrees/<branch>:w apps/microshift-vm/microshift-vm.yaml
limactl start <vm-name>
cd .worktrees/<branch>
limactl shell <vm-name> -- bash -c 'mise trust && mise install'
```

If you encounter a name length error when starting VM, shorten the name and retry.

## Development inside worktree and VM

- Project commands (`mise`, `uv run`, `pnpm`, etc.) run **inside the VM** using `limactl shell <vm-name> -- <command>`.
- Absolute path of worktree is same on host and guest, cwd is preserved by `limactl shell`.
- Use the normal Edit/Write tools directly on `.worktrees/<branch>/...` paths.
- To start the platform: `limactl shell <vm-name> -- mise run agentstack:start`
- Keep iterating until the feature is working and validated.

## When user confirms work is done

Git and `gh` are not configured inside the VM. Run these in worktree on host:

```bash
cd .worktrees/<branch>
git add <files>
git commit --signoff -m "<PR title>"
git push -u origin <branch>
gh pr create --web
```

## When user confirms worktree can be torn down

```bash
limactl delete -f <vm-name>
git worktree remove .worktrees/<branch>
```