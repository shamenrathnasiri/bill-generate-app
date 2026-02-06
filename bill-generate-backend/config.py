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

class Config:
    # Database filename set to 'abc bill db.db' as requested
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(DB_DIR, 'abc bill db.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key-here'
