import sqlite3
import os

from config import Config
import re

# Derive DB path from Config SQLALCHEMY_DATABASE_URI
uri = Config.SQLALCHEMY_DATABASE_URI
# Expecting format sqlite:///absolute/path
match = re.match(r"sqlite:///(.*)", uri)
db_path = match.group(1) if match else os.path.join(os.path.dirname(__file__), 'database.db')
print(f"Database path: {db_path}")
print(f"File exists: {os.path.exists(db_path)}")
print(f"File size: {os.path.getsize(db_path) if os.path.exists(db_path) else 'N/A'} bytes")

db = sqlite3.connect(db_path)
cur = db.cursor()

# List tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cur.fetchall()]
print(f"\nTables in database: {tables}")

# Show data from each table
for table in ['customers', 'services', 'bills']:
    if table in tables:
        cur.execute(f"SELECT * FROM {table}")
        rows = cur.fetchall()
        print(f"\n{table.upper()} ({len(rows)} rows):")
        for row in rows:
            print(f"  {row}")
    else:
        print(f"\n{table} table NOT FOUND!")

db.close()
