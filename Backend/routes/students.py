# Backend/routes/students.py

from flask import Blueprint, request, jsonify
from datetime import datetime
from services.connectDB import connect_db

students_routes = Blueprint("students_routes", __name__)

# -------------------------------------------------------------
# Convert MongoDB document to JSON safe dict
# -------------------------------------------------------------
def _doc_to_json(doc):
    if not doc:
        return None
    doc = dict(doc)
    doc["_id"] = str(doc["_id"])
    return doc

# -------------------------------------------------------------
# CHECK IF USER PROFILE EXISTS (by Clerk user_id)
# GET /api/students/check/<user_id>
# -------------------------------------------------------------
@students_routes.route("/students/check/<user_id>", methods=["GET"])
def check_student(user_id):
    db = connect_db()
    exists = db.Students.find_one({"user_id": user_id})
    return jsonify({"exists": bool(exists)}), 200

# -------------------------------------------------------------
# GET STUDENT BY EMAIL
# GET /api/students/by-email/<email>
# -------------------------------------------------------------
@students_routes.route("/students/by-email/<email>", methods=["GET"])
def get_student_by_email(email):
    db = connect_db()
    student = db.Students.find_one({"email": email})

    if not student:
        return jsonify({"success": False, "student": None}), 404

    return jsonify({
        "success": True,
        "student": _doc_to_json(student)
    }), 200

# -------------------------------------------------------------
# GET STUDENT BY user_id (Clerk id)
# GET /api/students/<user_id>
# -------------------------------------------------------------
@students_routes.route("/students/<user_id>", methods=["GET"])
def get_student_by_user_id(user_id):
    db = connect_db()
    student = db.Students.find_one({"user_id": user_id})

    if not student:
        return jsonify({"success": False, "student": None}), 404

    return jsonify({
        "success": True,
        "student": _doc_to_json(student)
    }), 200

# -------------------------------------------------------------
# ADD STUDENT PROFILE
# POST /api/students
# Body: { user_id, name, email, class, grade, school, hobbies, ... }
# -------------------------------------------------------------
@students_routes.route("/students", methods=["POST"])
def add_student():
    db = connect_db()
    data = request.get_json() or {}

    required = ["user_id", "name", "email"]
    for r in required:
        if r not in data or not data[r]:
            return jsonify({"success": False, "message": f"{r} is required"}), 400

    # Prevent duplicate (same user_id OR email)
    if db.Students.find_one({"$or": [
        {"user_id": data["user_id"]},
        {"email": data["email"]}
    ]}):
        return jsonify({"success": False, "message": "Profile already exists"}), 409

    student = {
        "user_id": data["user_id"],   # Clerk user ID as STRING
        "name": data["name"],
        "email": data["email"],
        "class": data.get("class"),
        "grade": data.get("grade"),
        "school": data.get("school"),
        "hobbies": data.get("hobbies"),
        "extracurriculars": data.get("extracurriculars"),
        "interests": data.get("interests"),
        "sports": data.get("sports"),
        "created_at": datetime.utcnow()
    }

    res = db.Students.insert_one(student)

    return jsonify({
        "success": True,
        "id": str(res.inserted_id)
    }), 201

# -------------------------------------------------------------
# UPDATE STUDENT BY user_id
# PUT /api/students/<user_id>
# -------------------------------------------------------------
@students_routes.route("/students/<user_id>", methods=["PUT"])
def update_student(user_id):
    db = connect_db()
    data = request.get_json() or {}

    update_fields = {
        "name": data.get("name"),
        "email": data.get("email"),
        "class": data.get("class"),
        "grade": data.get("grade"),
        "school": data.get("school"),
        "hobbies": data.get("hobbies"),
        "extracurriculars": data.get("extracurriculars"),
        "interests": data.get("interests"),
        "sports": data.get("sports"),
    }

    # Remove None keys
    update_fields = {k: v for k, v in update_fields.items() if v is not None}

    if not update_fields:
        return jsonify({"success": False, "message": "No fields to update"}), 400

    result = db.Students.update_one(
        {"user_id": user_id},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"success": False, "message": "Student not found"}), 404

    student = db.Students.find_one({"user_id": user_id})

    return jsonify({
        "success": True,
        "student": _doc_to_json(student)
    }), 200

# -------------------------------------------------------------
# GET ALL STUDENTS
# GET /api/students
# -------------------------------------------------------------
@students_routes.route("/students", methods=["GET"])
def get_students():
    db = connect_db()
    students = [_doc_to_json(s) for s in db.Students.find()]
    return jsonify(students), 200
