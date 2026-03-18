# Backend/routes/colleges.py

from flask import Blueprint, request, jsonify
from services.connectDB import connect_db
from bson import ObjectId
from pymongo import UpdateOne
import json

college_routes = Blueprint("college_routes", __name__)


def serialize_college(doc):
    doc["_id"] = str(doc["_id"])
    # Ensure interest is always present
    doc["interest"] = int(doc.get("interest", 0))
    return doc


# -----------------------------------
# GET /api/colleges  -> list colleges
# -----------------------------------
@college_routes.route("/colleges", methods=["GET"])
def get_colleges():
    db = connect_db()
    colleges_cursor = db.College.find()

    colleges = [serialize_college(c) for c in colleges_cursor]

    # total interest to help frontend compute %
    total_interest = sum(c["interest"] for c in colleges)

    return jsonify({
        "success": True,
        "data": colleges,
        "totalInterest": total_interest,
        "total": len(colleges)
    }), 200


# -----------------------------------
# POST /api/colleges -> add new college (optional)
# -----------------------------------
@college_routes.route("/colleges", methods=["POST"])
def add_college():
    db = connect_db()
    data = request.json or {}

    # default interest = 0
    data.setdefault("interest", 0)

    result = db.College.insert_one(data)

    return jsonify({
        "success": True,
        "message": "College added successfully",
        "id": str(result.inserted_id)
    }), 201


# -------------------------------------------------
# POST /api/colleges/interest-batch
# body: { "interest": { "<collegeId>": increment, ... } }
# -------------------------------------------------
@college_routes.route("/colleges/interest-batch", methods=["POST"])
def interest_batch():
    db = connect_db()

    # Read raw body (works for sendBeacon + fetch + axios)
    raw_data = request.get_data(as_text=True)
    print("🔥 RAW interest-batch BODY:", raw_data)

    payload = {}
    if raw_data:
        try:
            payload = json.loads(raw_data)
        except Exception as e:
            print("⚠ Failed to parse JSON from raw_data:", e)
            # fallback: try normal get_json
            payload = request.get_json(silent=True) or {}
    else:
        payload = request.get_json(silent=True) or {}

    interest_map = payload.get("interest", {})
    print("🧩 Parsed interest_map:", interest_map)

    if not isinstance(interest_map, dict) or not interest_map:
        return jsonify({"success": False, "message": "No interest data"}), 400

    updated_ids = []

    for college_id, inc in interest_map.items():
        try:
            inc = int(inc)
            if inc <= 0:
                continue

            # Try ObjectId, fallback to string ID
            try:
                oid = ObjectId(college_id)
                filter_query = {"_id": oid}
            except Exception:
                filter_query = {"_id": college_id}

            result = db.College.update_one(
                filter_query, {"$inc": {"interest": inc}})

            if result.modified_count > 0:
                updated_ids.append(college_id)
                print(f"✅ Incremented interest for {college_id} by {inc}")
            else:
                print(f"⚠ No document matched for {college_id}")

        except Exception as e:
            print("❌ Interest update error:", e)
            continue

    print("📊 Final updated_ids:", updated_ids)

    return jsonify({"success": True, "updated": updated_ids}), 200


@college_routes.route("/colleges/update-many", methods=["PUT"])
def update_many_colleges():
    db = connect_db()

    # Read JSON safely
    payload = request.get_json(silent=True) or {}
    updates = payload.get("updates", [])

    # If nothing to update → return early (no error)
    if not isinstance(updates, list) or len(updates) == 0:
        return jsonify({
            "success": True,
            "updated": [],
            "count": 0,
            "message": "No updates provided"
        }), 200

    bulk_ops = []
    updated_ids = []

    for item in updates:
        college_id = item.get("_id")
        update_data = item.get("data")

        # Validate each item
        if not college_id or not isinstance(update_data, dict):
            continue

        # Convert ID to ObjectId if possible
        try:
            oid = ObjectId(college_id)
        except:
            oid = college_id  # fallback string ID

        # Add bulk update operation
        bulk_ops.append(
            UpdateOne(
                {"_id": oid},
                {"$set": update_data}
            )
        )
        updated_ids.append(college_id)

    # Run bulk update
    if len(bulk_ops) > 0:
        db.College.bulk_write(bulk_ops)

    return jsonify({
        "success": True,
        "updated": updated_ids,
        "count": len(updated_ids),
        "message": "Bulk update completed"
    }), 200
