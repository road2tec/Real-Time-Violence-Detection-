import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(DATABASE_URL)
db = client[DATABASE_NAME]

users_collection = db["users"]
alerts_collection = db["alerts"]

def get_db():
    return db
