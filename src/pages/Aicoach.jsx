import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Circle,
  Send,
  UserRound,
  Bot,
  BadgeDollarSign,
  Users,
  Megaphone,
  ShieldAlert,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";
import { imageFour, imageTwo } from "../assets/localImages";

const suggestions = [
  "What should I charge for braiding in Nairobi?",
  "How do I get my first client?",
  "Write me an Instagram caption",
  "A client wants free work. What should I say?",
  "How do I raise my prices?",
];

const initialMessages = [
  {
    role: "ai",
    text: "Welcome. I am your SheEarns business coach. Ask anything about pricing, clients, social media, or growth.",
  },
];

export default function AICoach() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const payload = await apiRequest("/ai/coach", {
        method: "POST",
        body: JSON.stringify({
          text: userText,
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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif] flex flex-col">
      <Navbar active="AI Coach" />

      <main className="pt-24 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 gap-8 py-8">
        <div className="lg:w-100 shrink-0 flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start lg:pt-8" data-aos="fade-right">
          <div className="bg-[rgba(80,0,136,0.08)] self-start flex items-center gap-2 px-3 py-1.5 rounded-full">
            <Brain size={14} strokeWidth={2} className="text-[#500088]" />
            <span className="text-[#500088] text-xs font-bold uppercase tracking-wide sm:tracking-widest">AI Powered</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Your Personal Business Coach, Available 24/7
          </h1>

          <p className="text-[#4c4452] text-sm md:text-base leading-normal sm:leading-relaxed">
            Ask about pricing, clients, social media, and difficult customer situations.
          </p>

          <div className="relative rounded-3xl overflow-hidden h-56 mt-1">
            <img
              src={imageTwo}
              alt="African woman entrepreneur"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#500088] via-[rgba(80,0,136,0.15)] to-transparent" />
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-white font-bold text-sm">Available 24/7 for you</p>
              <p className="text-[#d7a8ff] text-xs">Ask me anything about your hustle</p>
            </div>
          </div>

          <div className="bg-white border border-[rgba(207,194,212,0.3)] rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[#1c1c18] text-sm font-bold">Advice Topics</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Pricing", Icon: BadgeDollarSign },
                { label: "First Clients", Icon: Users },
                { label: "Social Media", Icon: Megaphone },
                { label: "Difficult Clients", Icon: ShieldAlert },
              ].map((item) => (
                <span key={item.label} className="bg-[rgba(80,0,136,0.06)] text-[#500088] text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <item.Icon size={13} strokeWidth={2} /> {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-[rgba(207,194,212,0.2)] overflow-hidden" style={{ minHeight: "600px", maxHeight: "80vh" }} data-aos="fade-left">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f1ede7]">
            <div className="relative">
              <img
                src={imageFour}
                alt="AI Coach"
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#fea619]"
                loading="lazy"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-bold text-[#500088] text-base">SheEarns AI Coach</p>
              <p className="text-[#4c4452] text-xs flex items-center gap-1">
                <Circle size={8} fill="currentColor" className="text-green-400" /> Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 justify-center py-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="bg-[rgba(80,0,136,0.06)] text-[#500088] text-sm font-medium px-4 py-2 rounded-full hover:bg-[rgba(80,0,136,0.12)] transition-colors border border-[rgba(80,0,136,0.1)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === "ai" ? "bg-[#500088] text-white" : "bg-[#fea619] text-[#684000]"}`}>
                  {msg.role === "ai" ? <Bot size={15} strokeWidth={2} /> : <UserRound size={15} strokeWidth={2} />}
                </div>

                <div className={`max-w-[75%] px-4 py-3 text-sm leading-normal sm:leading-relaxed whitespace-pre-wrap ${msg.role === "ai" ? "bg-[rgba(80,0,136,0.05)] text-[#500088] rounded-bl-2xl rounded-br-2xl rounded-tr-2xl" : "bg-[#500088] text-white rounded-bl-2xl rounded-br-2xl rounded-tl-2xl"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="bg-[#500088] w-8 h-8 rounded-full flex items-center justify-center text-sm text-white">
                  <Bot size={14} strokeWidth={2} />
                </div>
                <div className="bg-[rgba(80,0,136,0.05)] px-4 py-3 rounded-2xl flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-[#500088] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-6 py-4 border-t border-[#f1ede7] flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Type your question here..."
                className="flex-1 bg-[#f7f3ed] text-[#1c1c18] text-sm px-5 py-4 rounded-2xl border-none outline-none placeholder-[rgba(76,68,82,0.5)]"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-[#fea619] text-[#684000] w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-[#ffb930] transition-colors disabled:opacity-50 shrink-0"
              >
                <Send size={17} strokeWidth={2} />
              </button>
            </div>
            <p className="text-[rgba(76,68,82,0.5)] text-xs text-center">AI advice is educational only. Verify market rates locally.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
