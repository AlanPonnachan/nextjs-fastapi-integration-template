# backend/main.py

import os
import json
from typing import List

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser # <-- Import the parser
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

# --- Load Environment Variables ---
load_dotenv()

# --- Pydantic Schemas ---
class ChatRequest(BaseModel):
    message: str
    history: List[dict]

# --- LangChain Chat Logic ---
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful and witty assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{message}"),
])

# --- CRITICAL FIX: Add the StrOutputParser to the chain ---
# This ensures the output of the chain is a clean stream of strings
chain = prompt | llm | StrOutputParser()
# ------------------------------------------------------------

# --- FastAPI App Initialization ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Generator for SSE ---
async def stream_chat_generator(request: ChatRequest):
    history = [
        HumanMessage(content=msg['content']) if msg['role'] == 'user' 
        else AIMessage(content=msg['content']) 
        for msg in request.history
    ]
    
    try:
        # astream() now yields strings directly because of StrOutputParser
        async for token in chain.astream({
            "message": request.message,
            "history": history
        }):
            if token:
                # Yield the token in the SSE data format
                yield f"data: {json.dumps({'token': token})}\n\n"
        
        yield "event: end\ndata: {}\n\n"
        
    except Exception as e:
        print(f"Error during streaming: {e}")
        error_payload = json.dumps({"error": str(e)})
        yield f"event: error\ndata: {error_payload}\n\n"

# --- API Endpoints ---
@app.post("/chat/stream")
async def stream_chat(request: ChatRequest):
    return StreamingResponse(stream_chat_generator(request), media_type="text/event-stream")

@app.get("/")
def read_root():
    return {"Template": "SSE Next.js + FastAPI Chat"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)