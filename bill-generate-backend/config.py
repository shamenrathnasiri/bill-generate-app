import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database filename set to 'abc bill db.db' as requested
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'abc bill db.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key-here'
