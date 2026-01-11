---
description: Deploy backend API to Oracle Cloud VM via SSH
allowed-tools: Bash
---

# Deploy Backend API

SSH to the Oracle Cloud VM and update the FastAPI backend.

## Steps

1. **Pull latest code and restart service**
   ```bash
   ssh -i ~/.ssh/ssh-key-2025-08-30.key ubuntu@129.151.153.128 "cd /opt/windsurf-api && git pull origin main && sudo systemctl restart windsurf-api"
   ```

2. **Verify the service is running**
   ```bash
   ssh -i ~/.ssh/ssh-key-2025-08-30.key ubuntu@129.151.153.128 "sudo systemctl status windsurf-api --no-pager -l"
   ```

3. **Test the API health endpoint**
   ```bash
   curl -s https://windsurf-world-tour-stats-api.duckdns.org/health || curl -s https://windsurf-world-tour-stats-api.duckdns.org/
   ```

4. **Report results**
   - Confirm git pull succeeded
   - Confirm service is active
   - Confirm API is responding

## Troubleshooting

If deployment fails:
- Check SSH connection: `ssh -i ~/.ssh/ssh-key-2025-08-30.key ubuntu@129.151.153.128 "echo connected"`
- Check service logs: `ssh -i ~/.ssh/ssh-key-2025-08-30.key ubuntu@129.151.153.128 "sudo journalctl -u windsurf-api -n 50 --no-pager"`
