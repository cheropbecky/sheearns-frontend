import { useState } from "react";
import {
  Scissors,
  CookingPot,
  Palette,
  BookOpen,
  Shirt,
  Camera,
  PenTool,
  Laptop,
  Dumbbell,
  Sparkles,
  Target,
  ArrowRight,
  Medal,
  CheckCircle2,
  HandCoins,
  Languages,
  Music,
  Megaphone,
  Smartphone,
  Flower2,
  Home,
  Baby,
  Car,
  Wrench,
  Briefcase,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import { imageTwo, imageSix, logo } from "../assets/localImages";

const skills = [
  { label: "Hair & Beauty", Icon: Scissors },
  { label: "Cooking & Baking", Icon: CookingPot },
  { label: "Art & Design", Icon: Palette },
  { label: "Teaching & Tutoring", Icon: BookOpen },
  { label: "Fashion & Sewing", Icon: Shirt },
  { label: "Photography", Icon: Camera },
  { label: "Writing", Icon: PenTool },
  { label: "Technology", Icon: Laptop },
  { label: "Fitness & Wellness", Icon: Dumbbell },
  { label: "Nail & Makeup Art", Icon: Sparkles },
  { label: "Sales & Retail", Icon: HandCoins },
  { label: "Translation & Languages", Icon: Languages },
  { label: "Music & Voice", Icon: Music },
  { label: "Social Media Marketing", Icon: Megaphone },
  { label: "Phone Repair", Icon: Smartphone },
  { label: "Agribusiness & Farming", Icon: Flower2 },
  { label: "Home Organization", Icon: Home },
  { label: "Childcare", Icon: Baby },
  { label: "Driving & Delivery", Icon: Car },
  { label: "Handcraft & Repairs", Icon: Wrench },
  { label: "Admin & Virtual Assistant", Icon: Briefcase },
  { label: "Event Support", Icon: Users },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hustleResults, setHustleResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState("");

  const toggleSkill = (label) => {
    setSelectedSkills((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSeeResults = async () => {
    if (selectedSkills.length === 0) {
      setResultsError("Select at least one skill to get personalized ideas.");
      return;
    }

    setLoadingResults(true);
    setResultsError("");

    try {
      const payload = {
        skills: selectedSkills,
        hours_per_week: 10,
        income_goal: 30000,
        work_style: "both",
      };

      const data = await apiRequest("/ai/assess", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setHustleResults(Array.isArray(data?.top_hustles) ? data.top_hustles : []);
      setStep(3);
    } catch (err) {
      setResultsError(err?.message || "Could not generate AI suggestions right now.");
      setStep(3);
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif] flex flex-col">
      <Navbar active="How It Works" />

      <main className={`flex-1 flex items-center justify-center px-4 py-12 pt-28 ${step === 1 ? "relative overflow-hidden h-100 sm:h-125 md:h-screen" : ""}`}>
        {step === 1 && (
          <>
            <img
              src={imageTwo}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-br from-[rgba(80,0,136,0.60)] to-[rgba(148,0,88,0.50)]" />
          </>
        )}
        {step === 1 && (
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-md text-center" data-aos="fade-up">
            <div className="w-40 h-40 rounded-full bg-white border border-[rgba(133,83,0,0.1)] flex items-center justify-center shadow-xl overflow-hidden">
              <img src={logo} alt="SheEarns Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl sm:text-5xl">
              Welcome to SheEarns
            </h1>
            <p className="text-white text-sm md:text-base">Find your best hustle path in two minutes.</p>
            <button
              onClick={() => setStep(2)}
              className="w-full inline-flex items-center justify-center gap-3 text-white font-bold text-sm md:text-base px-8 py-5 rounded-2xl shadow-lg hover:opacity-90 transition-opacity bg-[#500088]"
            >
              Start <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-2xl flex flex-col gap-8" data-aos="fade-up">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[#500088] text-sm font-bold uppercase tracking-wide sm:tracking-widest">Step 1 of 2</span>
                <span className="text-[#4c4452] text-xs">50% Complete</span>
              </div>
              <div className="h-2 bg-[#e6e2dc] rounded-full">
                <div className="h-2 bg-[#500088] rounded-full w-1/2 transition-all" />
              </div>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-xl sm:text-2xl lg:text-3xl">
              What are you naturally good at?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((s) => (
                <button
                  key={s.label}
                  onClick={() => toggleSkill(s.label)}
                  className={`flex flex-col items-center gap-2 py-6 rounded-2xl border-2 transition-all text-sm font-bold ${
                    selectedSkills.includes(s.label)
                      ? "border-[#500088] bg-white shadow-md"
                      : "border-transparent bg-white shadow-sm hover:border-[rgba(80,0,136,0.2)]"
                  }`}
                >
                  <s.Icon size={24} strokeWidth={1.7} className="text-[#500088]" />
                  <span className="text-[#1c1c18] text-center text-xs leading-tight">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-[#e6e2dc] text-[#1c1c18] font-bold rounded-2xl">Back</button>
              <button
                onClick={handleSeeResults}
                disabled={loadingResults}
                className="flex-1 py-4 text-white font-bold rounded-2xl shadow-md hover:opacity-90 bg-[#500088] inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingResults ? "Generating..." : "See Results"} <ArrowRight size={16} strokeWidth={1.8} />
              </button>
            </div>
            {resultsError && <p className="text-sm text-[#a60000] font-semibold">{resultsError}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-2xl flex flex-col gap-8" data-aos="fade-up">
            <div className="w-full h-48 sm:h-64 md:h-80 rounded-3xl overflow-hidden mb-2 relative">
              <img
                src={imageSix}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#500088] via-[rgba(80,0,136,0.2)] to-transparent" />
              <p className="absolute bottom-3 left-5 text-white font-bold text-sm md:text-base z-10">
                Your Top Hustles, Queen
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#ffddb8] inline-flex items-center gap-2 px-6 py-2 rounded-full">
                <Target size={16} strokeWidth={1.8} className="text-[#2a1700]" />
                <span className="text-[#2a1700] text-xs font-bold uppercase tracking-wide sm:tracking-widest">Perfect Matches Found</span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl sm:text-3xl lg:text-4xl text-center">
                Your Top Hustle Ideas
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {hustleResults.length > 0 ? (
                hustleResults.slice(0, 3).map((h, index) => (
                <div
                  key={`${h.name}-${index}`}
                  className={`rounded-3xl ${
                    index === 0
                      ? "bg-white border border-[rgba(133,83,0,0.1)] shadow-[0_0_0_4px_rgba(133,83,0,0.08)] p-8"
                      : "bg-[#f7f3ed] border-l-8 border-[#500088] pl-8 pr-6 py-6"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#f1ede7] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                      <Medal size={24} strokeWidth={1.8} className="text-[#500088]" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide sm:tracking-widest text-[#4c4452]">Top {index + 1}</span>
                        {index === 0 && <span className="text-[#855300] text-xs font-extrabold uppercase tracking-wide sm:tracking-widest">Top Pick</span>}
                      </div>
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#1c1c18] text-lg sm:text-xl lg:text-2xl">{h.name}</h3>
                      <p className="text-[#4c4452] text-base">{h.earning_potential}</p>
                      <p className="text-[#4c4452] text-sm">Time to first client: {h.time_to_first_client}</p>
                      <p className="inline-flex items-center gap-1 text-sm text-[#500088]">
                        <CheckCircle2 size={15} strokeWidth={1.8} /> {h.difficulty}
                      </p>
                      {h.why_fit && <p className="text-[#4c4452] text-sm mt-1">{h.why_fit}</p>}
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="rounded-3xl bg-white border border-[rgba(133,83,0,0.1)] p-8">
                  <p className="text-[#4c4452] text-base">
                    We could not fetch AI suggestions right now. Try again from the previous step.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <a
                href="/roadmap"
                className="w-full py-6 text-white font-extrabold text-xl rounded-3xl shadow-2xl hover:opacity-90 transition-opacity bg-[#500088] no-underline text-center inline-flex items-center justify-center gap-2"
              >
                Build My Plan <ArrowRight size={20} strokeWidth={2} />
              </a>
              <p className="text-[#4c4452] text-sm">Join other women building income this week.</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
