import os
import certifi  # For MacOs
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DBNAME = os.getenv("MONGO_DBNAME")

client = None
db = None

def connect_db():
    global client, db

    if client is None:
        try:
            # client = MongoClient(MONGO_URI)    # For Windows
            client = MongoClient(           # For MacOS
                MONGO_URI,                  # For MacOS
                tls=True,                   # For MacOS
                tlsCAFile=certifi.where()   # For MacOS
            )
            db = client[MONGO_DBNAME]
            print("🚀 MongoDB connected successfully!")
        except Exception as e:
            print("❌ MongoDB connection error:", e)

    return db
