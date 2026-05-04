import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { apiRequest } from "../api";

const initialMessages = [
  {
    role: "ai",
    text: "Welcome. I am your SheEarns business coach. Ask anything about pricing, clients, social media, or growth.",
  },
];

export default function FloatingAIChat({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Don't show the panel on the /aicoach page, but still show the button
  const shouldHidePanel = currentPath === "/aicoach" || currentPath === "/ai-coach";

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // Call the same API endpoint as the AICoach page
      const payload = await apiRequest("/ai/coach", {
        method: "POST",
        body: JSON.stringify({
          text,
          history: messages
            .filter((m, idx) => !(idx === 0 && m.role === "ai"))
            .map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.text,
            })),
        }),
      });

      const reply =
        payload?.reply ||
        "I am here to help. Try asking something specific about pricing, offers, or finding clients.";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-7 right-7 z-40 group"
        aria-label="Open AI Coach chat"
      >
        {/* Pulsing Ring Animation */}
        <div className="absolute inset-0 rounded-full bg-[#500088] opacity-75 group-hover:opacity-100 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-2 border-[#500088] opacity-50 group-hover:opacity-75 animate-pulse" style={{ animationDelay: "0.15s" }}></div>

        {/* Main Button */}
        <div className="relative flex items-center justify-center w-16 h-16 bg-[#500088] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200">
          <MessageCircle size={28} className="text-white" strokeWidth={1.5} />

          {/* Green Online Badge */}
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
        </div>
      </button>

      {/* Chat Panel */}
      {isOpen && !shouldHidePanel && (
        <div className="fixed bottom-24 right-7 z-50 w-96 max-w-[calc(100vw-28px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-[#500088] text-white px-6 py-4 flex items-center justify-between">
            <h2 className="font-bold text-lg">AI Coach</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 max-h-96 bg-[#fafaf9]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl ${
                    msg.role === "user"
                      ? "bg-[#500088] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#500088] focus:border-transparent text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 bg-[#500088] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              aria-label="Send message"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
