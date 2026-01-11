---
description: Run a database query and show results
allowed-tools: Bash, Read, Write
argument-hint: SQL query or plain English description
---

# Query Database

Run this database query: **$ARGUMENTS**

## Steps

1. **Understand the request**
   - If SQL provided, use it directly
   - If plain English, convert to SQL using schema from `backend/.claude/CLAUDE.md`

2. **Create a Python script** to run the query:

```python
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

conn = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    port=int(os.getenv('DB_PORT', '3306')),
    database=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD')
)

cursor = conn.cursor()
cursor.execute("""
    -- SQL query here
""")

# Print results as table
```

3. **Run the script** from the project root

4. **Format output** as a readable markdown table

## Available Tables/Views

- `PWA_IWT_EVENTS` - Event metadata (118 events)
- `PWA_IWT_RESULTS` - Final rankings (2,052 results)
- `PWA_IWT_HEAT_SCORES` - Individual scores (39,460 scores)
- `ATHLETES` - Unified athlete profiles (359 athletes)
- `ATHLETE_RESULTS_VIEW` - Results with athlete data
- `ATHLETE_SUMMARY_VIEW` - Career statistics

## Notes

- Requires SSH tunnel to database (check if running)
- Use `%s` for SQL placeholders (mysql-connector syntax)
