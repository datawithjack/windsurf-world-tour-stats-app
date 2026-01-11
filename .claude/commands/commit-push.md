# Commit and Push

Commit and push to current branch (without merging to main).

## Steps

1. **Check for changes**
   ```bash
   git status
   ```
   If no changes, tell the user and stop.

2. **Show diff and generate commit message**
   ```bash
   git diff
   git diff --cached
   git log --oneline -5
   ```
   Generate a clear, concise commit message based on the changes.

3. **Commit changes**
   ```bash
   git add -A
   git commit -m "Your generated message

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

4. **Push to current branch**
   ```bash
   git push origin HEAD
   ```
   If push fails because branch doesn't exist on remote, use:
   ```bash
   git push -u origin HEAD
   ```

5. **Report success**
   Tell the user what was committed and pushed.

## Notes

- Does NOT merge to main
- Use `/ship` to commit, push, AND merge to main
