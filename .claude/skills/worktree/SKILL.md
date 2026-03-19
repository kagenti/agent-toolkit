---
name: worktree
description: Work on features in isolated git worktrees backed by a dedicated Lima/MicroShift VM. Use only when invoked explicitly.
---

# Worktree Feature Development

This skill sets up an isolated development environment: a git worktree under `.worktrees/` backed by a dedicated Lima VM with the worktree mounted at the same path as on the host. All commands targeting the feature run inside the VM via `limactl shell`.

## Step 1 — Determine PR Title and Branch Name

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`, e.g. `feat(cli): add worktree support`, `fix(server): handle nil pointer`, `chore: update dependencies`. Common types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`.

1. Derive a **preliminary PR title** from the task description using this convention.
2. Derive the **branch name**:
   - Get committer name: `git config user.name`
   - Slugify: lowercase, remove diacritics/accents, replace spaces/special chars with nothing, e.g. "Jan Pokorný" → `janpokorny`
   - Slugify the PR title: strip `()`, replace `:` and spaces with `-`, collapse multiple `-`, e.g. `feat-cli-add-worktree-support`
   - Full branch: `<user-slug>/<title-slug>`, e.g. `janpokorny/feat-cli-add-worktree-support`
3. Derive the **VM name**: replace `/` with `-` and prepend `microshift-vm-`, e.g. `microshift-vm-janpokorny-feat-cli-add-worktree-support`. **Lima enforces a 76-character limit** — if the name would exceed it, shorten the title slug (drop filler words, abbreviate) until it fits.
4. Show the user the PR title, branch name, worktree path, and VM name, then proceed immediately.

## Step 2 — Create Worktree

```bash
# Fetch latest main, then create worktree
git fetch origin main
git worktree add -b <branch> .worktrees/<branch> origin/main
```

Example: `.worktrees/janpokorny/feat-cli-add-worktree-support`

## Step 3 — Build VM Image and Copy Dist

Run the QEMU build **in the root checkout** (not the worktree), then copy the dist artifacts into the worktree so the VM can use them without a full rebuild:

```bash
# In repo root
mise run microshift-vm:build:qemu

# Copy dist into worktree (preserves the worktree's own git state)
cp -r apps/microshift-vm/dist .worktrees/<branch>/apps/microshift-vm/dist
```

## Step 4 — Create and Start the Lima VM

Create the VM from the template, disabling default mounts and adding the worktree as a r/w mount. Lima mirrors the host path inside the VM (e.g. host `/Users/jp/.../.worktrees/<branch>` is accessible at the same path in the VM):

Run from the **repo root**:

```bash
limactl create \
  --name <vm-name> \
  --mount-only=.worktrees/<branch>:w \
  apps/microshift-vm/microshift-vm.yaml

limactl start <vm-name>
```

Wait for the VM to be fully running before proceeding (`limactl list` shows status `Running`).

## Step 5 — Set Up Project Inside VM

All subsequent commands run **inside the VM** using `limactl shell <vm-name> -- <command>`. The worktree is available at the same absolute path as on the host (e.g. `/Users/jp/ghq/github.com/kagenti/adk/.worktrees/<branch>`):

```bash
limactl shell <vm-name> -- bash -c 'cd <worktree-abs-path> && mise trust && mise install'
```

## Step 6 — Do the Work

- **File edits**: use the normal Edit/Write tools directly on `.worktrees/<branch>/...` paths — the worktree is mounted r/w in the VM so changes are immediately visible inside.
- **Commands** (builds, tests, CLIs, etc.): always run via `limactl shell <vm-name> -- bash -c 'cd <worktree-abs-path> && <command>'`.
- To start the platform: `limactl shell <vm-name> -- bash -c 'cd <worktree-abs-path> && mise run agentstack:start'`
- Keep iterating until the feature is working and validated.

## Step 7 — Commit and Open PR (outside the VM)

Git and `gh` are not configured inside the VM. Run these in the root repo or worktree directory on the host:

```bash
# Stage and commit in the worktree directory
cd .worktrees/<branch>
git add <files>
git commit --signoff -m "<final PR title>"

# Push and open PR in browser
git push -u origin <branch>
gh pr create --web
```

## Step 8 — Teardown (after PR is merged or no longer needed)

After the user confirms work is done, offer to clean up:

```bash
# Stop and delete the VM
limactl stop <vm-name>
limactl delete <vm-name>

# Remove the worktree (from repo root)
git worktree remove .worktrees/<branch>
```

## Reference

| Item | Example |
|------|---------|
| PR title | `feat(cli): add worktree support` |
| Branch | `janpokorny/feat-cli-add-worktree-support` |
| Worktree path | `.worktrees/janpokorny/feat-cli-add-worktree-support` |
| VM name | `microshift-vm-janpokorny-feat-cli-add-worktree-support` |
| VM mount | same host path (r/w), e.g. `/Users/jp/.../worktrees/<branch>` |
| Run command in VM | `limactl shell <vm-name> -- bash -c 'cd <worktree-abs-path> && <cmd>'` |

## Rules

- Never run feature commands directly on the host — always use `limactl shell <vm-name> -- ...`
- Git commits and `gh pr create` must be run on the host (git is not set up in the VM)
- All commits must be signed off (`git commit --signoff`) per DCO requirements
- The VM build step (Step 3) always runs in the **repo root**, not the worktree
- Always confirm PR title, branch name, and VM name with the user before creating anything
