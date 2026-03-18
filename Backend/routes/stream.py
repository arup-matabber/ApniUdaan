""" improvements
data recheck """

from flask import Blueprint, request, jsonify
from services.connectDB import connect_db

stream_routes = Blueprint("stream_routes", __name__)

@stream_routes.route("/streams", methods=["POST"])
def add_stream():
    db = connect_db()
    data = request.json

    if not data:
        return jsonify({"success": False, "message": "No input data"}), 400

    result = db.Stream.insert_one(data)

    return jsonify({
        "success": True,
        "message": "Stream added successfully",
        "id": str(result.inserted_id)
    }), 201


@stream_routes.route("/streams", methods=["GET"])
def get_streams():
    db = connect_db()
    stream_list = list(db.Stream.find())

    for s in stream_list:
        s["_id"] = str(s["_id"])

    return jsonify(stream_list), 200
