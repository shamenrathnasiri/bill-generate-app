import os
import re
import shutil
from datetime import datetime

from config import Config, DB_PATH
from app import create_app


def get_db_path():
    # Use the DB_PATH directly from config
    return DB_PATH


def backup_and_remove(path: str):
    if not os.path.exists(path):
        print(f"No DB file found at {path}")
        return
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup = f"{path}.bak-{ts}"
    shutil.move(path, backup)
    print(f"Backed up existing DB to: {backup}")


def recreate_db():
    db_path = get_db_path()
    print(f"Database path: {db_path}")
    backup_and_remove(db_path)

    # create app which will initialize and create tables
    app = create_app()
    print("Created new database (tables created).")


if __name__ == '__main__':
    recreate_db()
