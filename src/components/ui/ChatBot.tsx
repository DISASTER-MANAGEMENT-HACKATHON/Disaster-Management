"use client";

import { useState, useRef, useEffect } from "react";

export function ChatBot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, isLoading, mounted]);

  if (!mounted) return null;

  // Handler to reset chat state and return to main protocol menu
  const handleResetChat = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    
    // Intercept "back" or "reset" commands from text input
    if (messageContent.toLowerCase().trim() === 'back' || messageContent.toLowerCase().trim() === 'reset') {
        handleResetChat();
        return;
    }

    if (!messageContent.trim() || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: messageContent }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageContent }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            assistantMessage += line.replace("data: ", "");
          } else if (!line.startsWith("data:")) {
            assistantMessage += line;
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantMessage.trim() };
          return updated;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error to dispatch core." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999999, isolation: "isolate" }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "14px 22px",
            borderRadius: "9999px",
            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)",
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.2)",
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "16px" }}>💬</span> RESCUECHAIN AI
        </button>
      ) : (
        <div 
          style={{
            width: "380px",
            height: "520px",
            backgroundColor: "#090d16",
            color: "#f8fafc",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div style={{ padding: "14px 18px", backgroundColor: "#0f172a", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontWeight: 700, fontSize: "13px", letterSpacing: "0.5px", color: "#ffffff" }}>RESCUECHAIN AI</span>
              <span style={{ fontSize: "10px", backgroundColor: "#1e293b", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>LIVE</span>
              
              {/* Back Button - Only shows when there are messages */}
              {messages.length > 0 && (
                 <button
                  onClick={handleResetChat}
                  title="Return to Main Menu"
                  style={{
                    backgroundColor: "#1e293b",
                    color: "#94a3b8",
                    border: "1px solid #334155",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginLeft: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#334155";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e293b";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                 >
                   ← BACK
                 </button>
              )}

            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
            >
              ✕
            </button>
          </div>

          {/* Messages & Welcome State */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                <div style={{ backgroundColor: "#1e293b", padding: "12px 14px", borderRadius: "10px", border: "1px solid #334155" }}>
                  <p style={{ fontWeight: 600, color: "#ffffff", fontSize: "13px", marginBottom: "4px" }}>🛡️ Guwahati Dispatch Core Ready</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>Select a protocol below or type your tactical query.</p>
                </div>

                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", fontWeight: 700, marginTop: "4px" }}>Quick Protocols</p>
                
                {[
                  "Flash Flood Alert Status",
                  "Available Fleet Check",
                  "Strategic Evacuation Route"
                ].map((protocol, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(protocol)}
                    style={{
                      textAlign: "left",
                      backgroundColor: "#0f172a",
                      color: "#cbd5e1",
                      border: "1px solid #1e293b",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e293b";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "#3b82f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#0f172a";
                      e.currentTarget.style.color = "#cbd5e1";
                      e.currentTarget.style.borderColor = "#1e293b";
                    }}
                  >
                    ⚡ {protocol}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    maxWidth: "88%",
                    fontSize: "13px",
                    lineHeight: "1.4",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#2563eb" : "#1e293b",
                    color: "#ffffff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.content}
                </div>
              ))
            )}

            {/* Typing Indicator Animation */}
            {isLoading && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#1e293b",
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  width: "50px",
                  justifyContent: "center"
                }}
              >
                <span className="dot" style={{ width: "6px", height: "6px", backgroundColor: "#94a3b8", borderRadius: "50%", animation: "pulse 1.4s infinite ease-in-out" }}></span>
                <span className="dot" style={{ width: "6px", height: "6px", backgroundColor: "#94a3b8", borderRadius: "50%", animation: "pulse 1.4s infinite ease-in-out 0.2s" }}></span>
                <span className="dot" style={{ width: "6px", height: "6px", backgroundColor: "#94a3b8", borderRadius: "50%", animation: "pulse 1.4s infinite ease-in-out 0.4s" }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div style={{ padding: "12px", borderTop: "1px solid #1e293b", backgroundColor: "#0f172a", display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type dispatch query..."
              style={{
                flex: 1,
                padding: "10px 12px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid #334155",
                backgroundColor: "#090d16",
                color: "#ffffff",
                outline: "none"
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Global CSS keyframes for smooth dot pulse */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1.0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default ChatBot;