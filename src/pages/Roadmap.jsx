import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MessageCircle,
  Camera,
  Users,
  Zap,
  Send,
  Star,
  TrendingUp,
  Copy,
  RefreshCw,
  Award,
  Map,
  Smartphone,
} from "lucide-react";

const steps = [
  {
    day: "Day 1",
    icon: MessageCircle,
    iconBg: "bg-[#6b21a8]",
    title: "Set Up WhatsApp Business Profile",
    desc: "Your first digital storefront. Set a professional name, clear profile photo, service category, and a bio that tells clients exactly what you offer.",
    template:
      "Hi! I'm [Name], a professional [service] based in [city]. I offer [main service] starting from Ksh [price]. DM me to book or learn more!",
    templateLabel: "WhatsApp Bio Template",
  },
  {
    day: "Day 2",
    icon: Camera,
    iconBg: "bg-[#940058]",
    title: "Take 5 Portfolio Photos",
    desc: "Use natural window light. Shoot your work from multiple angles. A good phone camera is enough. Before/after shots perform best on social media.",
    template:
      "Fresh set done today in [City]! Ksh [price] for [service]. DM to book yours this week. Limited slots!",
    templateLabel: "Caption Template",
  },
  {
    day: "Day 3",
    icon: Users,
    iconBg: "bg-[#fea619]",
    title: "Join 3 Facebook Groups in Your City",
    desc: "Search '[Your City] Buy & Sell', '[City] Ladies Network', '[City] Services'. Introduce yourself professionally with your best photo.",
    template:
      "Hi everyone! I'm [Name], a [service] based in [area]. Offering [service] at Ksh [price]. Check my photos and DM for bookings!",
    templateLabel: "Group Post Template",
  },
  {
    day: "Day 4",
    icon: Zap,
    iconBg: "bg-[#500088]",
    title: "Post Your First Offer",
    desc: "Use your best portfolio photo. Write a clear, confident caption. Post simultaneously to WhatsApp Status, Facebook, and Instagram for maximum reach.",
    template:
      "I'm officially opening my schedule for [Service]! I help [audience] achieve [result]. DM to book — limited slots this week!",
    templateLabel: "First Post Template",
  },
  {
    day: "Day 5",
    icon: Send,
    iconBg: "bg-[#940058]",
    title: "Send This Message to 10 People",
    desc: "Text friends, family, former classmates. Personalize the first sentence. Don't be shy — they genuinely want to support you getting started.",
    template:
      "Hey [Name]! I've started offering [service] professionally. I'd love to practice on someone I trust — would you like a session at a friend rate of Ksh [price]?",
    templateLabel: "Outreach DM Template",
  },
  {
    day: "Week 2",
    icon: Star,
    iconBg: "bg-[#fea619]",
    title: "Deliver for Your First Client & Get a Review",
    desc: "Do exceptional work. After the session, send the review request below. One glowing review is worth more than 100 followers.",
    template:
      "Hi [Name]! Thank you so much for trusting me today. If you're happy with the results, would you mind leaving me a quick review? It means the world to me!",
    templateLabel: "Review Request Template",
  },
  {
    day: "Week 3",
    icon: TrendingUp,
    iconBg: "bg-[#500088]",
    title: "Raise Your Price by 20%",
    desc: "You've proven yourself. One client = proof of delivery. Update your WhatsApp bio and social posts with the new rate confidently.",
    template:
      "Exciting update! Due to high demand, my rates are now Ksh [new price] for [service]. Book before [date] to lock in the current rate!",
    templateLabel: "Price Increase Announcement",
  },
];

const templates = [
  {
    icon: Smartphone,
    iconBg: "bg-[rgba(80,0,136,0.08)]",
    iconColor: "text-[#500088]",
    label: "Social Media",
    title: "Instagram Caption Template",
    text: "I'm officially opening my schedule for [Service Name]! I help [Target Audience] achieve [Result] so they can [Outcome]. Prices start from Ksh [Amount]. DM to book or learn more!",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-[rgba(254,166,25,0.1)]",
    iconColor: "text-[#855300]",
    label: "Outreach",
    title: "DM to Friends & Family",
    text: "Hi [Name]! I've just started offering [service] professionally and I'd love to practice on someone I trust. Would you like a session at a special friend rate of Ksh [discounted price]?",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-[rgba(148,0,88,0.08)]",
    iconColor: "text-[#940058]",
    label: "Follow Up",
    title: "Follow Up Message",
    text: "Hey [Name], just checking in! Did you get a chance to look at my last message? I'd love to help you with [service]. I have a slot open this week — interested?",
  },
  {
    icon: Star,
    iconBg: "bg-[rgba(80,0,136,0.08)]",
    iconColor: "text-[#500088]",
    label: "Reviews",
    title: "How to Ask for a Review",
    text: "Hi [Name]! It was such a pleasure working with you today. If you enjoyed the service, would you mind leaving me a quick review? Even a sentence helps so much. Thank you!",
  },
];

export default function Roadmap() {
  const [expandedStep, setExpandedStep] = useState(-1);
  const [copiedTemplate, setCopiedTemplate] = useState("");

  const copyToClipboard = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplate(key);
      setTimeout(() => setCopiedTemplate(""), 2000);
    } catch {
      setCopiedTemplate("copy-error");
      setTimeout(() => setCopiedTemplate(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Roadmap" />

      <main className="px-6 pb-20">
        <section className="pt-32 pb-8 min-h-[300px] relative overflow-hidden" data-aos="fade-down">
          <img
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(80,0,136,0.82)] to-[rgba(80,0,136,0.65)]" />
          <div className="relative z-10 max-w-[896px] mx-auto text-center max-w-2xl">
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-5xl leading-tight inline-flex items-center gap-3 justify-center">
              <Map size={42} strokeWidth={1.8} />
              Your First Client Is Closer Than You Think
            </h1>
            <p className="text-white text-xl mt-4 leading-relaxed">
              Follow this proven day-by-day roadmap. Every queen who has landed
              her first client followed these exact steps.
            </p>
          </div>
        </section>

        <div className="my-4" />

        <section className="py-16" data-aos="fade-up">
          <div className="max-w-[848px] mx-auto relative">
            <div className="flex justify-center mb-10" data-aos="zoom-in">
              <div className="bg-[rgba(80,0,136,0.08)] text-[#500088] font-bold text-sm px-6 py-3 rounded-full border border-[rgba(80,0,136,0.2)] inline-flex items-center gap-2">
                <Award size={16} /> Your Journey Starts Here
              </div>
            </div>

            <div className="absolute top-20 bottom-20 left-1/2 -translate-x-1/2 w-1 bg-[rgba(80,0,136,0.15)] border-l border-dashed border-[rgba(80,0,136,0.25)]" />

            <div className="relative space-y-7">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLeft = index % 2 === 0;
                const isExpanded = expandedStep === index;
                const copiedKey = `step-${index}`;
                return (
                  <div key={step.title} className="relative" data-aos={isLeft ? "fade-right" : "fade-left"} data-aos-delay={index * 100}>
                    <div className="absolute left-1/2 top-8 -translate-x-1/2 w-12 h-12 rounded-full bg-[#500088] text-white font-bold text-lg flex items-center justify-center shadow-lg z-10 border-4 border-[#fdf9f3]">
                      {index + 1}
                    </div>

                    <article
                      className={`bg-white rounded-3xl shadow-sm p-8 border border-[rgba(207,194,212,0.2)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 w-full md:w-[calc(50%-2rem)] ${
                        isLeft ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center`}>
                          <Icon size={22} className="text-white" />
                        </div>
                        <span className="text-[#855300] text-xs font-bold uppercase tracking-widest bg-[rgba(133,83,0,0.1)] px-3 py-1 rounded-full">
                          {step.day}
                        </span>
                      </div>

                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl leading-snug mb-3">
                        {step.title}
                      </h3>

                      <p className="text-[#4c4452] text-sm leading-relaxed mb-5">{step.desc}</p>

                      <button
                        type="button"
                        onClick={() => {
                          setExpandedStep(isExpanded ? -1 : index);
                          copyToClipboard(copiedKey, step.template);
                        }}
                        className="inline-flex items-center gap-2 text-[#500088] text-sm font-bold hover:gap-3 transition-all"
                      >
                        <Copy size={14} /> {step.templateLabel} - Click to copy
                      </button>

                      {isExpanded && (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => copyToClipboard(copiedKey, step.template)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              copyToClipboard(copiedKey, step.template);
                            }
                          }}
                          className="mt-4 bg-[rgba(80,0,136,0.05)] border border-[rgba(80,0,136,0.1)] rounded-2xl p-4 text-sm text-[#500088] font-medium leading-relaxed italic cursor-copy"
                        >
                          {step.template}
                        </div>
                      )}

                      {copiedTemplate === copiedKey && (
                        <p className="text-xs text-[#500088] font-bold mt-3">Copied!</p>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center" data-aos="zoom-in">
              <div className="bg-gradient-to-r from-[#fea619] to-[#f59e0b] text-[#684000] font-extrabold text-xl px-8 py-5 rounded-3xl shadow-xl inline-flex items-center gap-3">
                <Award size={28} /> FIRST CLIENT UNLOCKED!
              </div>
              <p className="text-[#4c4452] text-sm text-center mt-2">
                You're officially a SheEarns Queen!
              </p>
            </div>
          </div>
        </section>

        <div className="my-4" />

        <section className="py-16" data-aos="fade-up">
          <div className="max-w-[896px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-2xl">
                Ready-to-Use Templates
              </h2>
              <div className="flex-1 h-px bg-[rgba(207,194,212,0.4)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {templates.map((item, index) => {
                const TplIcon = item.icon;
                const copiedKey = `template-${index}`;
                const isCopied = copiedTemplate === copiedKey;
                return (
                  <article
                    key={item.title}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.2)] hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                          <TplIcon size={18} className={item.iconColor} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.iconBg} ${item.iconColor}`}>
                          {item.label}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(copiedKey, item.text)}
                        className="inline-flex items-center gap-1 text-[#500088] text-xs font-bold hover:underline"
                      >
                        <Copy size={12} /> {isCopied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <h3 className="font-bold text-[#1c1c18] text-base mb-2">{item.title}</h3>
                    <p className="text-[#4c4452] text-sm leading-relaxed italic line-clamp-3">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="my-4" />

        <section className="py-16" data-aos="fade-up">
          <div className="max-w-[896px] mx-auto">
            <div
              className="w-full rounded-3xl relative overflow-hidden p-10"
              style={{ background: "linear-gradient(135deg, #500088, #940058)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=1200&q=60&auto=format&fit=crop"
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(80,0,136,0.86)] to-[rgba(148,0,88,0.82)]" />
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[rgba(254,166,25,0.15)] blur-2xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col">
                  <span className="self-start bg-[rgba(254,166,25,0.2)] text-[#fea619] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    AI Coach Available 24/7
                  </span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white text-3xl mt-3">
                    Stuck on a step?
                  </h3>
                  <p className="text-[#d7a8ff] text-lg mt-2 leading-relaxed">
                    Your AI Business Sister is online 24/7 to help you refine your
                    offer, write captions, or practice your pitch.
                  </p>
                  <a
                    href="/ai-coach"
                    className="mt-6 self-start bg-[#fea619] text-[#684000] font-bold text-base px-6 py-3 rounded-2xl hover:bg-[#ffb930] transition-colors no-underline inline-flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> Chat with AI Coach
                  </a>
                </div>

                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-4">
                    <div className="bg-[rgba(255,255,255,0.15)] text-white text-sm p-3 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl max-w-[92%]">
                      Hey Queen! What step are you on today?
                    </div>
                    <div className="bg-[#fea619] text-[#684000] text-sm font-medium p-3 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl ml-auto max-w-[80%]">
                      Day 4 - just posted my first offer!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
