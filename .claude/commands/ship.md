# Ship

Commit, push, and merge to main in one command.

## Steps

1. **Check for changes**
   ```bash
   git status
   ```
   If no changes, tell the user and stop.

2. **Run tests** (frontend and backend in parallel)
   ```bash
   cd frontend && npm test
   cd backend && pytest
   ```
   If tests fail, stop and report the failures. Do NOT proceed with broken tests.

3. **Build frontend** (verify TypeScript compiles)
   ```bash
   cd frontend && npm run build
   ```
   If build fails, stop and report the errors.

4. **Show diff and generate commit message**
   ```bash
   git diff --stat
   git log --oneline -5
   ```
   Generate a clear, concise commit message based on the changes.

5. **Commit changes**
   ```bash
   git add -A
   git commit -m "Your generated message

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

6. **Push to current branch**
   ```bash
   git push origin HEAD
   ```

7. **Merge to main** (if not already on main)
   ```bash
   git checkout main
   git pull origin main
   git merge <branch-name> --no-edit
   git push origin main
   git checkout <branch-name>
   ```

8. **Report success**
   Tell the user:
   - What was committed
   - That it's now on main
   - Vercel will auto-deploy

## Safety Checks

- STOP if tests fail
- STOP if build fails
- STOP if there are merge conflicts (ask user to resolve)
- STOP if push fails (ask user to pull first)

## Notes

- Tests and build must pass before shipping
- This deploys to production via Vercel auto-deploy
- Use `/commit-push` if you want to push without merging to main
