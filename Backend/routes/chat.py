from flask import Blueprint, request, jsonify
from typing import Dict, Any, List


def create_chat_blueprint(chat_service) -> Blueprint:
    bp = Blueprint("chat", __name__)

    @bp.post("/chat")
    def chat() -> Any:
        """
        Body supports:
        {
          "messages": [
            {"role": "system"|"user"|"assistant", "content": "text"}
          ]
        }
        Returns:
        {
          "role": "assistant",
          "content": "text",
          "model": "gemini-2.5-flash"
        }
        """
        data: Dict[str, Any] = request.get_json(silent=True) or {}
        messages: List[Dict[str, str]] = data.get("messages", [])
        if not isinstance(messages, list) or not messages:
            return jsonify({"error": "messages array is required"}), 400

        try:
            reply_text = chat_service.generate(messages)
            return jsonify(
                {"role": "assistant", "content": reply_text, "model": chat_service.model_name}
            ), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return bp
