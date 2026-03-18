from flask import Blueprint, request, jsonify
from services.connectDB import connect_db

content_routes = Blueprint("content_routes", __name__)

@content_routes.route("/content", methods=["POST"])
def add_content():
    db = connect_db()
    data = request.json

    if not data:
        return jsonify({"success": False, "message": "No input data"}), 400

    result = db.Content.insert_one(data)

    return jsonify({
        "success": True,
        "message": "Content added successfully",
        "id": str(result.inserted_id)
    }), 201


@content_routes.route("/content", methods=["GET"])
def get_content():
    db = connect_db()
    content_list = list(db.Content.find())

    for c in content_list:
        c["_id"] = str(c["_id"])

    return jsonify(content_list), 200
