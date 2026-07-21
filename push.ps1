<#
Commits all changes and pushes them to GitHub.

Usage:
  .\push.ps1
  .\push.ps1 "Custom commit message"
#>

param(
    [string]$Message
)

$env:PATH = "$env:ProgramFiles\Git\cmd;" + $env:PATH

git add -A

git diff --cached --quiet
$changesExist = ($LASTEXITCODE -ne 0)

if (-not $changesExist) {
    Write-Output "No changes to commit."
    exit 0
}

if (-not $Message) {
    $Message = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

git commit -m $Message
git push origin main

Write-Output "Done: changes committed and pushed."
