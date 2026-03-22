from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from config import setup_environment
from agent import setup_agent

# 1. Setup Environment Variables
setup_environment()

# 2. Setup Agent
finance_agent = setup_agent()

# 3. Create FastAPI app
app = FastAPI(title="FinBot API", description="API to interact with FinBot the financial LangGraph agent")

# 4. Enable CORS so the Next.js frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Define Request and Response Models
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = "default-session"

class ChatResponse(BaseModel):
    response: str

# 6. Expose the agent via a POST endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        config = {"configurable": {"thread_id": request.thread_id}}
        
        # Invoke the agent
        agent_trace = finance_agent.invoke(
            {"messages": [{"role": "user", "content": request.message}]},
            config
        )
        
        # The agent's final response will be the last message content
        last_message = agent_trace["messages"][-1].content
        return ChatResponse(response=last_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
