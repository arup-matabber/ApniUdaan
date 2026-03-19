import os
from dataclasses import dataclass
from typing import Dict, Any


DEFAULT_SYSTEM_PROMPT_PATH = "config/system_prompt.txt"
DEFAULT_MODEL = "gemini-2.5-flash"


@dataclass
class Settings:
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = DEFAULT_MODEL
    SYSTEM_PROMPT_PATH: str = DEFAULT_SYSTEM_PROMPT_PATH

    @staticmethod
    def from_env() -> "Settings":
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Please add it to your .env file."
            )
        model = os.getenv("GEMINI_MODEL", DEFAULT_MODEL).strip()
        prompt_path = os.getenv("SYSTEM_PROMPT_PATH", DEFAULT_SYSTEM_PROMPT_PATH).strip()
        return Settings(
            GEMINI_API_KEY=api_key,
            GEMINI_MODEL=model,
            SYSTEM_PROMPT_PATH=prompt_path,
        )

    def load_system_prompt(self) -> str:
        try:
            with open(self.SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
                prompt = f.read().strip()
                return prompt if prompt else "You are a helpful career advisor."
        except FileNotFoundError:
            # Fallback if user hasn't added a prompt yet
            return "You are a helpful career advisor."

 
    def gemini_safety_settings(self) -> Dict[str, Any]:
        # Refer to Google Generative AI safety settings documentation if you need to tweak.
        # Keep permissive defaults; tighten for production compliance.
        return {
            # Example placeholder; the python SDK handles defaults if omitted.
            # "HARASSMENT": "BLOCK_NONE",
        }

    # Optional: centralize generation parameters
    def gemini_generation_config(self) -> Dict[str, Any]:
        return {
            "temperature": float(os.getenv("GENERATION_TEMPERATURE", "0.4")),
            "top_p": float(os.getenv("GENERATION_TOP_P", "0.95")),
            "top_k": int(os.getenv("GENERATION_TOP_K", "40")),
            "max_output_tokens": int(os.getenv("GENERATION_MAX_TOKENS", "1024")),
        }
