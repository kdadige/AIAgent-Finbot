"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw, Loader2, DollarSign } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content: "Hello! I am FinBot, your expert equity research analyst. What stock or market trend can I help you analyze today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, thread_id: "web-session-1" }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data.response,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (error) {
      console.error(error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Sorry, I encountered an error connecting to the server.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center p-2 sm:p-8">
      <div className="w-full max-w-4xl flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full border border-blue-500/30">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent title-glow">FinBot Terminal</h1>
              <p className="text-xs text-slate-400">Advanced Equity Analyst Agent</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            title="Clear Chat"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth z-10 hidden-scrollbar min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border ${
                msg.role === "user" 
                  ? "bg-purple-500/20 border-purple-500/30" 
                  : "bg-blue-500/20 border-blue-500/30"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-sm sm:text-base whitespace-pre-wrap ${
                msg.role === "user" 
                  ? "bg-purple-600/30 border border-purple-500/30 text-purple-50 rounded-tr-sm" 
                  : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm relative list-styles"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border bg-blue-500/20 border-blue-500/30">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-slate-400">Analyzing market data...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-white/5 border-t border-white/10 z-10 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a stock or market sector..."
              disabled={isLoading}
              className="w-full bg-black/20 border border-white/10 rounded-full pl-6 pr-14 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-slate-100 placeholder:text-slate-500 disabled:opacity-50 transition-all text-sm sm:text-base backdrop-blur-sm"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
             <span className="text-[10px] sm:text-xs text-slate-500">AI can make mistakes. Verify financial data independently.</span>
          </div>
        </div>
      </div>
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </main>
  );
}
