import os
import sys

# Handle PyInstaller bundled executable
if getattr(sys, 'frozen', False):
    # Running as compiled executable
    BASE_DIR = os.path.dirname(sys.executable)
else:
    # Running as script
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Use persistent directory from Electron (APP_DB_DIR env variable) if available,
# otherwise fall back to the base directory.
# This ensures the database is stored in a user data folder that persists
# across app restarts and updates.
DB_DIR = os.environ.get('APP_DB_DIR', BASE_DIR)

# Ensure the database directory exists
if not os.path.exists(DB_DIR):
    try:
        os.makedirs(DB_DIR, exist_ok=True)
    except Exception:
        # Fallback to base directory if we can't create the directory
        DB_DIR = BASE_DIR

# Build the database path - use forward slashes for SQLite URI compatibility on Windows
DB_PATH = os.path.join(DB_DIR, 'abc bill db.db')
# Convert Windows backslashes to forward slashes for SQLite URI
DB_PATH_URI = DB_PATH.replace('\\', '/')

class Config:
    # Database filename set to 'abc bill db.db' as requested
    # Using forward slashes for cross-platform SQLite URI compatibility
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH_URI}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key-here'
    
    # Store the actual DB path for debugging
    DB_FILE_PATH = DB_PATH
