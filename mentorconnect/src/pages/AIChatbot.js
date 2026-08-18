import React, { useState, useRef, useEffect } from "react";

function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI mentor 👋" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 text-xl font-semibold shadow">
        AI Mentor Chat
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl shadow text-gray-500 animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>

      </div>
    </div>
  );
}

export default AIChatbot;