import os
import getpass
from langchain_groq import ChatGroq

os.environ["USER_AGENT"] = "FinBot/1.0"

def setup_environment():
    if "GROQ_API_KEY" not in os.environ:
        os.environ["GROQ_API_KEY"] = getpass.getpass("Enter your Groq API key: ")
    if "SERPAPI_API_KEY" not in os.environ:
        os.environ["SERPAPI_API_KEY"] = getpass.getpass("Enter your SerpAPI API key: ")

def get_llm():
    return ChatGroq(
        model="openai/gpt-oss-20b",
        temperature=0,
        max_tokens=None,
        reasoning_format="parsed",
        timeout=None,
        max_retries=2,
    )
