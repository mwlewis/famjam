param(
  [Parameter(Mandatory=$true)][string]$RepoName
)

# Requires Git + GitHub CLI (gh). Install from:
# winget install Git.Git
# winget install GitHub.cli
# Then: gh auth login

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Write-Error "Git not found. Install with 'winget install Git.Git'."; exit 1 }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Error "GitHub CLI not found. Install with 'winget install GitHub.cli'."; exit 1 }

git init
git add .
git commit -m "Initial commit: SillyFam Video Party"
gh repo create $RepoName --public --source . --remote origin --push

# Figure out your repo URL
$remote = git remote get-url origin
Write-Host "Repo pushed: $remote"
$deployUrl = "https://render.com/deploy?repo=$remote"
Write-Host "Deploy to Render: $deployUrl"
Start-Process $deployUrl
