import { Camera, Music2, MessageCircleMore } from "lucide-react";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "How It Works", href: "/onboarding" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "AI Coach", href: "/aicoach" },
      { label: "Blog", href: "/blog" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Contact Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Safety Rules", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#fdf9f3] border-t border-[rgba(207,194,212,0.2)] font-['Inter',sans-serif]">
      <img
        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&q=40&auto=format&fit=crop"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.03]"
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-4">
          <h4 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-[#500088]">SheEarns</h4>
          <p className="text-[#4c4452] text-sm leading-relaxed">
            Empowering African women to turn skills into reliable income with tools, coaching, and clients.
          </p>
          <div className="flex gap-2">
            {[Camera, Music2, MessageCircleMore].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#f1ede7] flex items-center justify-center text-[#500088] hover:bg-[rgba(80,0,136,0.1)] transition-colors">
                <Icon size={16} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <h5 className="font-bold text-[#500088] text-base">{col.title}</h5>
            <div className="flex flex-col gap-2">
              {col.links.map((link) => (
                <a key={link.label} href={link.href} className="no-underline text-sm text-[#4c4452] hover:text-[#500088] transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-8 py-5 border-t border-[rgba(207,194,212,0.2)] flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-sm text-[#4c4452]">
        <p>Built for women building income, one hustle at a time. © 2026 SheEarns</p>
        <p className="text-[rgba(76,68,82,0.7)]">Designed in Nairobi</p>
      </div>
    </footer>
  );
}
