# Commit and Push

Commit and push to current branch (without merging to main).

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
   If tests fail, stop and report the failures.

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
   If push fails because branch doesn't exist on remote, use:
   ```bash
   git push -u origin HEAD
   ```

7. **Report success**
   - Tell the user what was committed and pushed
   - Remind them Vercel will auto-deploy if pushed to main

## Notes

- Tests and build must pass before committing
- Does NOT merge to main
- Use `/ship` to commit, push, AND merge to main
- Vercel auto-deploys when code is pushed to `main` branch
