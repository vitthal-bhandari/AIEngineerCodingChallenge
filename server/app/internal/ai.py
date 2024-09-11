from __future__ import annotations

import os
from typing import AsyncGenerator

from dotenv import load_dotenv
from openai import AsyncOpenAI

from app.internal.prompt import PROMPT, PROMPT_AI_SUGGESTION

# Don't modify this file

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL") or "gpt-3.5-turbo-1106"


def get_ai(
    model: str | None = OPENAI_MODEL,
    api_key: str | None = OPENAI_API_KEY,
) -> AI:
    if not api_key or not model:
        raise ValueError("Both API key and model need to be set")
    return AI(api_key, model)


class AI:
    def __init__(self, api_key: str, model: str):
        self.model = model
        self._client = AsyncOpenAI(api_key=api_key)
        self._random_error_probability = 0.05

    async def review_document(self, document: str) -> AsyncGenerator[str | None, None]:
        """
        Review patent document and provide suggestions.

        Arguments:
        document -- Patent document to review. Will error if this includes HTML or markdown.

        Response:
        Should return a generator that yields a review from an AI.
        The review should be in the following JSON format:
        { "issues": [
            {
                "type": <error_type>,
                "severity": <high|medium|low>,
                "paragraph": <paragraph_number>,
                "description": <description_of_error>,
                "suggestion": <suggested_correction>
            }
            ...
        ]}
        """
        stream = await self._client.chat.completions.create(
            model=self.model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": PROMPT},
                {"role": "user", "content": document},
            ],
            stream=True,
        )

        async for chunk in stream:
            yield chunk.choices[0].delta.content

    async def incorporate_suggestions(self, document: str, paragraph: int, suggestion: str) -> AsyncGenerator[str | None, None]:
        stream = await self._client.chat.completions.create(
            model=self.model,
            response_format={"type": "text"},
            messages=[
                {"role": "system", "content": suggestion},
                {"role": "user", "content": document},
                {"role": "user", "content": paragraph},
                {"role": "user", "content": suggestion},
            ],
            stream=True,
        )

        async for chunk in stream:
            yield chunk.choices[0].delta.content