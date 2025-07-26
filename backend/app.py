# backend/app.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import sqlite3
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
DB_PATH = "ecommerce.db"

class ChatRequest(BaseModel):
    user_id: int
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    user_message: str
    ai_response: str

# ✅ Updated function to call Groq LLM
def get_ai_response(user_msg: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "mixtral-8x7b-32768",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant for an e-commerce platform."},
            {"role": "user", "content": user_msg}
        ]
    }

    try:
        res = requests.post(url, headers=headers, json=body)
        res.raise_for_status()
        data = res.json()
        if "choices" in data and data["choices"] and "message" in data["choices"][0] and "content" in data["choices"][0]["message"]:
            return data["choices"][0]["message"]["content"].strip()
        else:
            return "Error: Unexpected response format from LLM."
    except Exception as e:
        return f"Error contacting LLM: {str(e)}"

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Step 1: Get or create conversation
    if req.conversation_id:
        conversation_id = req.conversation_id
    else:
        cursor.execute("INSERT INTO conversations (user_id) VALUES (?)", (req.user_id,))
        conversation_id = cursor.lastrowid

    # Step 2: Insert user message
    cursor.execute(
        "INSERT INTO messages (conversation_id, sender, content) VALUES (?, 'user', ?)",
        (conversation_id, req.message)
    )

    # Step 3: Generate AI response
    ai_reply = get_ai_response(req.message)

    # Step 4: Insert AI message
    cursor.execute(
        "INSERT INTO messages (conversation_id, sender, content) VALUES (?, 'ai', ?)",
        (conversation_id, ai_reply)
    )

    conn.commit()
    conn.close()

    return ChatResponse(
        conversation_id=conversation_id,
        user_message=req.message,
        ai_response=ai_reply
    )
