from flask import Blueprint, request, jsonify
from services.connectDB import connect_db

degree_routes = Blueprint("degree_routes", __name__)

@degree_routes.route("/degrees", methods=["POST"])
def add_degree():
    db = connect_db()
    data = request.json

    if not data:
        return jsonify({"success": False, "message": "No input data"}), 400

    result = db.Degree.insert_one(data)

    return jsonify({
        "success": True,
        "message": "Degree added successfully",
        "id": str(result.inserted_id)
    }), 201


@degree_routes.route("/degrees", methods=["GET"])
def get_degrees():
    db = connect_db()
    degree_list = list(db.Degree.find())

    for d in degree_list:
        d["_id"] = str(d["_id"])

    return jsonify(degree_list), 200
