import sys
import os
sys.path.append(os.getcwd())
from app.core.config import settings
print(f"DATABASE_URL: {settings.DATABASE_URL}")
print(f"CWD: {os.getcwd()}")
