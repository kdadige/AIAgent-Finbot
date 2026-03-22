from config import setup_environment
from agent import setup_agent

def main():
    # 1. Setup Environment (API Keys)
    print("Setting up environment variables...")
    setup_environment()

    # 2. Setup Agent
    print("Initializing FinBot...")
    finance_agent = setup_agent()

    # 3. Running Sample Queries
    print("\n" + "="*50)
    print("Running Query 1: NVDA Brief")
    print("="*50)
    
    config = {"configurable": {"thread_id": "user-session-1"}}
    
    agent_trace = finance_agent.invoke(
        {"messages": [{"role": "user", "content": "Give me a quick analyst brief on NVDA. Is now a good time to buy?"}]},
        config
    )
    print(agent_trace["messages"][-1].content)

    print("\n" + "="*50)
    print("Running Query 2: Compare NVDA with AMD")
    print("="*50)

    agent_resp_2 = finance_agent.invoke(
        {"messages": [{"role": "user", "content": "Now compare it with AMD"}]},
        config
    )
    print(agent_resp_2["messages"][-1].content)

if __name__ == "__main__":
    main()
