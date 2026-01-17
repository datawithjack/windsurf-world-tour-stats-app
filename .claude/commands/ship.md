# Ship

Commit, push to dev, and merge to main in one command.

## Steps

1. **Check current branch**
   ```bash
   git branch --show-current
   ```
   - If on `main` → STOP with message: "Switch to dev branch first. Use `git checkout dev`"
   - If on a feature branch (not `dev` or `main`) → STOP with message: "Switch to dev or use /commit-push first to push your feature branch"
   - If on `dev` → proceed

2. **Check for changes**
   ```bash
   git status
   ```
   If no changes, tell the user and stop.

3. **Run tests** (frontend and backend in parallel)
   ```bash
   cd frontend && npm test
   cd backend && pytest
   ```
   If tests fail, stop and report the failures. Do NOT proceed with broken tests.

4. **Build frontend** (verify TypeScript compiles)
   ```bash
   cd frontend && npm run build
   ```
   If build fails, stop and report the errors.

5. **Show diff and generate commit message**
   ```bash
   git diff --stat
   git log --oneline -5
   ```
   Generate a clear, concise commit message based on the changes.

6. **Commit changes**
   ```bash
   git add -A
   git commit -m "Your generated message

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

7. **Push to dev**
   ```bash
   git push origin dev
   ```

8. **Merge to main**
   ```bash
   git checkout main
   git pull origin main
   git merge dev --no-edit
   git push origin main
   git checkout dev
   ```

9. **Report success**
   Tell the user:
   - What was committed
   - That it's now on main
   - Vercel will auto-deploy to production (windsurfworldtourstats.com)

## Safety Checks

- STOP if not on `dev` branch
- STOP if tests fail
- STOP if build fails
- STOP if there are merge conflicts (ask user to resolve)
- STOP if push fails (ask user to pull first)

## Notes

- Tests and build must pass before shipping
- This deploys to production via Vercel auto-deploy
- Use `/commit-push` if you want to push without merging to main
- Dev branch gets a Vercel preview URL automatically
