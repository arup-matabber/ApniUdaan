from flask import Blueprint, request, jsonify
from services.connectDB import connect_db
from bson import ObjectId

school_interest_routes = Blueprint("school_interest_routes", __name__)


@school_interest_routes.route("/school-interest/increment", methods=["POST"])
def increment_school_interest():
    db = connect_db()
    data = request.get_json() or {}

    college_id = data.get("college_id")
    school = data.get("school")

    if not college_id or not school:
        return jsonify({"success": False, "message": "college_id and school required"}), 400

    # Convert to ObjectId
    try:
        college_obj = ObjectId(college_id)
    except:
        return jsonify({"success": False, "message": "Invalid college_id"}), 400

    # Find existing record
    record = db.SchoolInterest.find_one({"college_id": college_obj, "school": school})

    if record:
        db.SchoolInterest.update_one(
            {"college_id": college_obj, "school": school},
            {"$inc": {"count": 1}}
        )
    else:
        db.SchoolInterest.insert_one({
            "college_id": college_obj,
            "school": school,
            "count": 1
        })

    return jsonify({"success": True}), 200



@school_interest_routes.route("/school-interest/<college_id>/<school>", methods=["GET"])
def get_school_interest(college_id, school):
    db = connect_db()

    try:
        college_obj = ObjectId(college_id)
    except:
        return jsonify({"success": False, "count": 0}), 200

    record = db.SchoolInterest.find_one({"college_id": college_obj, "school": school})

    return jsonify({
        "success": True,
        "count": record["count"] if record else 0
    }), 200
