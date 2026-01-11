# Ship

Commit, push, and merge to main in one command.

## Steps

1. **Check for changes**
   ```bash
   git status
   ```
   If no changes, tell the user and stop.

2. **Run tests** (if they exist)
   ```bash
   cd frontend && npm test -- --run 2>/dev/null || echo "No tests or tests skipped"
   ```
   If tests fail, stop and report the failures. Do NOT proceed with broken tests.

3. **Show diff and generate commit message**
   ```bash
   git diff
   git diff --cached
   ```
   Generate a clear, concise commit message based on the changes.

4. **Commit changes**
   ```bash
   git add -A
   git commit -m "Your generated message

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

5. **Push to current branch**
   ```bash
   git push origin HEAD
   ```

6. **Merge to main** (if not already on main)
   ```bash
   git checkout main
   git pull origin main
   git merge <branch-name> --no-edit
   git push origin main
   git checkout <branch-name>
   ```

7. **Report success**
   Tell the user:
   - What was committed
   - That it's now on main
   - Remind them Vercel will auto-deploy

## Safety Checks

- STOP if tests fail
- STOP if there are merge conflicts (ask user to resolve)
- STOP if push fails (ask user to pull first)

## Notes

- This deploys to production via Vercel auto-deploy
- Use `/commit-push` if you want to push without merging to main
