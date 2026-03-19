import logging
from typing import List, Dict, Any, Optional, Tuple

import google.generativeai as genai

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    fmt = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
    handler.setFormatter(fmt)
    logger.addHandler(handler)


class GeminiChatService:
    """
    Gemini wrapper with:
    - Conversation memory
    - No manual safety settings (avoids block_low errors)
    - Safe extraction (never crashes on resp.text)
    - Always returns a reply
    """

    def __init__(
        self,
        api_key: str,
        model_name: str,
        system_prompt: str,
        generation_config: Dict[str, Any] | None = None,
    ) -> None:

        if not api_key:
            raise RuntimeError("GEMINI_API_KEY missing")

        genai.configure(api_key=api_key)

        self.model_name = model_name
        self.system_prompt = system_prompt

        # Create model
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_prompt,
            generation_config=generation_config or {},
        )

        # ⭐ Persistent chat session (MEMORY)
        self.chat = self.model.start_chat(history=[])

    @staticmethod
    def _extract(resp: Any) -> Tuple[Optional[str], Optional[Any]]:
        """Safely extract text."""
        try:
            txt = getattr(resp, "text", None)
            if isinstance(txt, str) and txt.strip():
                return txt.strip(), None
        except Exception:
            pass

        cand = getattr(resp, "candidates", None)
        if cand:
            first = cand[0]
            content = getattr(first, "content", None)
            parts = getattr(content, "parts", None)

            if parts:
                p = parts[0]

                if isinstance(p, str):
                    return p.strip(), None

                if isinstance(p, dict):
                    return (p.get("text") or p.get("content") or "").strip(), None

                return str(p).strip(), None

        try:
            return str(resp), None
        except:
            return None, None

    def generate(self, messages: List[Dict[str, str]]) -> str:
        """
        ALWAYS returns a string.
        With conversation memory.
        """

        # Find last user message only
        last_user = None
        for m in reversed(messages):
            if m["role"] == "user":
                last_user = m["content"]
                break

        if not last_user:
            return "Please provide a message."

        try:
            # ⭐ Use chat.send_message WITH MEMORY
            resp = self.chat.send_message(last_user)

            text, _ = self._extract(resp)
            if text:
                return text

        except Exception as e:
            logger.error(f"Gemini error: {e}")

        return "I'm here to help! Can you ask your question in a different way?"
