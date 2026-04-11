import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowRight,
  Crown,
  Star,
  Lightbulb,
  DollarSign,
  Palette,
  BookOpen,
  Camera,
  Sparkles,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

const imgAmina = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&auto=format&fit=crop";
const imgZawadi = "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80&auto=format&fit=crop";
const imgBrenda = "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200&q=80&auto=format&fit=crop";
const imgHero = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80&auto=format&fit=crop";

const hustles = [
  { name: "Hair Braiding", rate: "Ksh 1,200 - 5,000", unit: "per style", level: "Beginner Friendly", levelColor: "text-[#855300] bg-[rgba(133,83,0,0.1)]", icon: Crown },
  { name: "Graphic Design", rate: "Ksh 2,000 - 15,000", unit: "per project", level: "Intermediate", levelColor: "text-[#500088] bg-[rgba(80,0,136,0.1)]", icon: Palette },
  { name: "Tutoring", rate: "Ksh 800 - 3,000", unit: "per hour", level: "Beginner Friendly", levelColor: "text-[#855300] bg-[rgba(133,83,0,0.1)]", icon: BookOpen },
  { name: "Photography", rate: "Ksh 5,000 - 20,000", unit: "per shoot", level: "Intermediate", levelColor: "text-[#500088] bg-[rgba(80,0,136,0.1)]", icon: Camera },
  { name: "Nail Art", rate: "Ksh 1,200 - 5,000", unit: "per set", level: "Beginner Friendly", levelColor: "text-[#855300] bg-[rgba(133,83,0,0.1)]", icon: Sparkles },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#fdf9f3] min-h-screen font-['Inter',sans-serif]">
      <Navbar active="Home" />

      <section className="pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h1 data-aos="fade-right" className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-5xl lg:text-[72px] leading-[1] tracking-tight">
              Turn Your Skills<br />Into Money
            </h1>
            <p data-aos="fade-right" data-aos-delay="120" className="text-[#4c4452] text-xl lg:text-2xl leading-relaxed max-w-[560px]">
              SheEarns helps young women monetize what they are already good at with AI guidance, smart pricing tools, and a strong community.
            </p>
            <div data-aos="fade-up" data-aos-delay="220" className="flex flex-wrap gap-4 pt-4">
              <a href="/onboarding" className="flex items-center gap-2 text-white font-bold text-lg px-8 py-4 rounded-3xl shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 no-underline bg-[#500088]">
                Find My Hustle <ArrowRight size={20} strokeWidth={1.5} />
              </a>
              <a href="/roadmap" className="border-2 border-[#cfc2d4] text-[#1c1c18] font-bold text-lg px-8 py-4 rounded-3xl hover:border-[#500088] transition-all duration-200 active:scale-95 no-underline inline-flex items-center gap-2">
                See How It Works
              </a>
            </div>
          </div>

          <div data-aos="fade-left" className="relative flex justify-center">
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-[rgba(133,83,0,0.1)] blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-[rgba(80,0,136,0.05)] blur-3xl" />
            <div className="relative rotate-2 rounded-[32px] overflow-hidden shadow-2xl w-full max-w-[520px]">
              <img src={imgHero} alt="Young African woman smiling while working on her business" loading="eager" fetchPriority="high" decoding="async" className="w-full h-full object-cover object-center aspect-[4/5]" />
              <div className="absolute top-4 right-4 bg-[#fea619] flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg">
                <Star size={14} strokeWidth={1.5} className="text-[#684000] fill-[#684000]" />
                <span className="text-xs font-bold text-[#684000]">Top Earner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f7f3ed] overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-4xl">Popular Hustles</h2>
              <p className="text-[#4c4452] text-base mt-2">See what other women are making money with right now.</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {hustles.map((hustle, i) => (
              <div key={hustle.name} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white rounded-3xl p-6 shadow-sm shrink-0 w-[280px] flex flex-col gap-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-[#f1ede7] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <hustle.icon size={20} strokeWidth={1.5} className="text-[#500088]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1c1c18] text-lg leading-tight">{hustle.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${hustle.levelColor}`}>{hustle.level}</span>
                  </div>
                </div>
                <p className="font-bold text-[#500088] text-xl">{hustle.rate}</p>
                <p className="text-[#4c4452] text-sm">{hustle.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#ebe8e2]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right" className="flex flex-col gap-6">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-5xl leading-tight">Your Personal Empire Consultant</h2>
            <p className="text-[#4c4452] text-xl leading-relaxed">
              Get practical advice for services, pricing, and client outreach from an AI coach tuned for local business context.
            </p>
            <a href="/aicoach" className="self-start flex items-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-3xl shadow-lg hover:opacity-90 transition-all duration-200 active:scale-95 no-underline bg-[#500088]">
              Chat With AI Coach <ArrowRight size={20} strokeWidth={1.5} />
            </a>
          </div>

          <div data-aos="fade-left" className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5 max-w-[448px] mx-auto w-full">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f1ede7]">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80&auto=format&fit=crop" alt="AI Coach" loading="lazy" className="w-10 h-10 rounded-full object-cover object-top border-2 border-[#fea619]" />
              <div>
                <p className="font-bold text-[#500088] text-base">SheEarns AI Coach</p>
                <p className="text-[#855300] text-xs font-bold inline-flex items-center gap-1"><ShieldCheck size={14} strokeWidth={1.5} /> Online</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[rgba(80,0,136,0.05)] text-[#500088] text-sm font-medium p-4 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl max-w-[85%]">
                What skills do you have right now?
              </div>
              <div className="bg-[#500088] text-white text-sm font-medium p-4 rounded-bl-2xl rounded-br-2xl rounded-tl-2xl ml-auto max-w-[85%]">
                Hair braiding and makeup.
              </div>
              <div className="bg-[rgba(80,0,136,0.05)] text-[#500088] text-sm font-medium p-4 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl max-w-[90%]">
                Great start. In Nairobi, knotless braids can be priced between Ksh 1,200 and Ksh 3,500.
              </div>
            </div>

            <div className="bg-[#f1ede7] rounded-full px-4 py-3 inline-flex items-center gap-2">
              <MessageCircle size={16} strokeWidth={1.5} className="text-[#4c4452]" />
              <p className="text-[rgba(76,68,82,0.5)] text-sm">Type your answer...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#fdf9f3]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-4xl">Voices of Success</h2>
            <p className="text-[#4c4452] text-base mt-4">Real stories from women building their dreams on SheEarns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: imgAmina, name: "Amina", role: "Hair Specialist", quote: '"SheEarns helped me double my pricing with confidence."' },
              { img: imgZawadi, name: "Zawadi", role: "Freelance Designer", quote: '"I found my first five clients in week one."' },
              { img: imgBrenda, name: "Brenda", role: "Meal Prep Chef", quote: '"The community keeps me consistent and motivated."' },
            ].map((t, i) => (
              <div key={t.name} data-aos="fade-up" data-aos-delay={i * 150} className="bg-white rounded-3xl p-8 shadow-sm flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={`${t.name} portrait`} loading="lazy" className="w-14 h-14 rounded-full object-cover object-center" />
                  <div>
                    <p className="font-bold text-[#500088] text-base">{t.name}</p>
                    <p className="text-[#855300] text-xs font-bold uppercase tracking-wide">{t.role}</p>
                  </div>
                </div>
                <Stars />
                <p className="text-[#4c4452] text-base italic leading-relaxed">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-[1024px] mx-auto">
          <div data-aos="zoom-in" className="relative rounded-3xl p-20 text-center overflow-hidden shadow-2xl bg-[#500088]">
            <img src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=1200&q=60&auto=format&fit=crop" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(80,0,136,0.92)] to-[rgba(148,0,88,0.88)]" />
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[rgba(133,83,0,0.1)]" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[rgba(107,0,62,0.1)]" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#d7a8ff] text-5xl leading-tight">Your Hustle Is Waiting</h2>
              <p className="text-[rgba(215,168,255,0.8)] text-xl leading-relaxed max-w-[600px]">
                Join women across Kenya already earning with their skills.
              </p>
              <a href="/signup" className="bg-[#fea619] text-[#684000] font-bold text-xl px-10 py-5 rounded-3xl hover:bg-[#ffb930] transition-all duration-200 active:scale-95 shadow-lg mt-2 no-underline inline-flex items-center gap-2">
                Start Earning Today <ArrowRight size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
