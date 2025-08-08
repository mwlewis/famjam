# SillyFam Video Party 🎭🗣️

Up to 4-person silly video chat: **WebRTC + face masks + goofy voices**. HTTPS + WebSockets ready.

## One‑click Deploy to Render
Click the button **after** you push this repo to GitHub (update the link with your repo URL):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME)

Replace `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` with your actual repo path, then click it.

---

## Manual Deploy (Render UI)
1. Create a new GitHub repo and upload these files.
2. In Render → **New → Web Service**, connect the repo.
3. Set Build: `npm install`, Start: `npm start`, Instance: **Free**.
4. Deploy. Open the HTTPS URL, pick a Room name, and share it.

## Option: publish this repo from your PC (GitHub CLI)
Windows PowerShell:
```powershell
scripts\windows_publish.ps1 -RepoName sillyfam
```
macOS/Linux:
```bash
bash scripts/macos_linux_publish.sh sillyfam
```
These will:
- Initialize git
- Create a public GitHub repo named `sillyfam` under your account (requires `gh auth login`)
- Push the code and print your **Deploy to Render** link

## Requirements
- Modern browser (Chrome/Edge/Firefox/Safari)
- Camera + mic permissions
- Render free plan will sleep after inactivity

## Notes
- Works on phones/tablets because it’s HTTPS + `wss://` signaling.
- If older phones lag, lower camera resolution in `public/index.html`.
