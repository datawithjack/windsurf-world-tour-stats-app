---
description: Run frontend and backend tests
allowed-tools: Bash
---

# Run All Tests

Run tests for both frontend and backend, reporting any failures.

## Steps

1. **Frontend tests** (if configured)
   ```bash
   cd frontend && npm test
   ```

2. **Backend tests** (if configured)
   ```bash
   cd backend && pytest
   ```

3. **Report results**
   - List any failures with file:line references
   - Show test coverage summary if available
   - Suggest fixes for failing tests

## Notes
- Tests may not be set up yet (this is on the backlog)
- If tests don't exist, report that and suggest next steps
