---
name: push
description: Commit all pending changes in the Urologie Biberach homepage and push them to GitHub (origin main). Use when the user asks to "check in", "commit", "push", or "einchecken" the code.
---

Run the project's push script from the repo root:

```
powershell -ExecutionPolicy Bypass -File .\push.ps1
```

Pass a commit message as an argument if the user gave one or if a short, specific summary of the recent changes is obvious from the conversation, e.g.:

```
powershell -ExecutionPolicy Bypass -File .\push.ps1 "Add appointment dropdown"
```

If no specific message fits, let the script fall back to its default timestamp message.

The script stages everything (`git add -A`), skips the commit if there is nothing staged, commits, and pushes to `origin main`. Report the result briefly: what was committed (or that there was nothing to commit) and whether the push succeeded.
