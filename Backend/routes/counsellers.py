from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import re

from services.connectDB import connect_db

counseller_routes = Blueprint("counseller_routes", __name__)

def _doc_to_json(doc):
    if not doc:
        return doc
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if "user_id" in doc and isinstance(doc["user_id"], ObjectId):
        doc["user_id"] = str(doc["user_id"])
    return doc

def _is_email(e):
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", e or ""))

@counseller_routes.route("/counsellers", methods=["POST"])
def add_counseller():
    db = connect_db()
    data = request.get_json() or {}

    # minimal required fields
    user_id = data.get("user_id")
    name = data.get("name")
    email = data.get("email")

    if not (user_id and name and email):
        return jsonify({"success": False, "message": "user_id, name and email are required"}), 400
    if not _is_email(email):
        return jsonify({"success": False, "message": "invalid email"}), 400

    try:
        user_obj = ObjectId(user_id)
    except Exception:
        return jsonify({"success": False, "message": "invalid user_id"}), 400

    # prevent duplicate profile for same user (basic)
    if db.Students.find_one({"user_id": user_obj}):
        return jsonify({"success": False, "message": "profile already exists"}), 409

    student = {
        "user_id": user_obj,
        "name": name,
        "email": email,
        "age": data.get("age"),
        "class": data.get("class"),
        "created_at": datetime.utcnow()
    }

    res = db.Counsellers.insert_one(student)
    return jsonify({"success": True, "id": str(res.inserted_id)}), 201

@counseller_routes.route("/counsellers", methods=["GET"])
def get_counsellers():
    db = connect_db()
    counsellers = [ _doc_to_json(s) for s in db.Counsellers.find() ]
    print("counsellers:")
    return jsonify(counsellers), 200