# Commit and Push

Commit and push to current branch (without merging to main).

## Steps

1. **Check current branch**
   ```bash
   git branch --show-current
   ```
   - If on `main` → STOP with message: "Cannot commit to main. Switch to dev or a feature branch first."
   - If on `dev` or a feature branch → proceed

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
   If tests fail, stop and report the failures.

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

7. **Push to current branch**
   ```bash
   git push origin HEAD
   ```
   If push fails because branch doesn't exist on remote, use:
   ```bash
   git push -u origin HEAD
   ```

8. **Report success**
   - Tell the user what was committed and pushed
   - If on `dev`: Vercel will create a preview deployment
   - Remind them to use `/ship` when ready to deploy to production

## Safety Checks

- STOP if on `main` branch
- STOP if tests fail
- STOP if build fails

## Notes

- Tests and build must pass before committing
- Does NOT merge to main
- Use `/ship` to commit, push, AND merge to main (from dev branch only)
- Pushing to `dev` triggers Vercel preview deployment
