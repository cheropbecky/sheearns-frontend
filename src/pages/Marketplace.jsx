import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Star, BadgeCheck, ShoppingBag, ArrowRight, SearchX } from "lucide-react";
import { apiRequest } from "../api";

const categories = [
  "All",
  "Hair & Beauty",
  "Nail Art",
  "Makeup & MUA",
  "Skincare",
  "Fashion & Tailoring",
  "Photography",
  "Graphic Design",
  "Web Design",
  "Video Editing",
  "Social Media",
  "Tutoring",
  "Fitness & Wellness",
  "Cooking & Catering",
  "Baking & Pastry",
  "Cleaning Services",
  "Virtual Assistant",
  "Writing & Copywriting",
  "Music & Dance",
  "Events Planning",
  "Tech Support",
];

const marketplaceHeroImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=60&auto=format&fit=crop";

const fallbackAvatar = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&q=80&auto=format&fit=crop";

const queenFallbackAvatars = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&auto=format&fit=crop&face",
  "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80&auto=format&fit=crop",
];

function formatPriceRange(min, max) {
  const safeMin = Number(min || 0);
  const safeMax = Number(max || 0);
  if (safeMax > safeMin) {
    return `Ksh ${safeMin.toLocaleString()} - ${safeMax.toLocaleString()}`;
  }
  return `From Ksh ${safeMin.toLocaleString()}`;
}

function ServiceCard({ service, index, onBook }) {
  const avatar = service.avatar_url || service.avatar || service.portfolio_urls?.[0] || queenFallbackAvatars[index % queenFallbackAvatars.length] || fallbackAvatar;

  return (
    <div data-aos="fade-up" data-aos-delay={index * 100} className="bg-white rounded-3xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-[rgba(80,0,136,0.2)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <img src={avatar} alt={service.provider_name || "Provider"} loading="lazy" className="w-16 h-16 rounded-2xl object-cover object-top flex-shrink-0" />
        <div className="flex items-center gap-1 bg-[rgba(80,0,136,0.05)] px-2 py-1 rounded-full">
          <Star size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
          <span className="text-[#500088] text-sm font-bold">{service.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-[#4c4452] text-xs">({service.review_count || 0})</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg">{service.provider_name || "SheEarns Queen"}</h3>
          <BadgeCheck size={16} strokeWidth={1.5} className="text-[#500088]" />
        </div>
        <p className="text-[#500088] text-sm font-medium">{service.title}</p>
        <p className="text-[#4c4452] text-sm inline-flex items-center gap-1">
          <MapPin size={14} strokeWidth={1.5} /> {service.location}
        </p>
      </div>

      <div className="border-t border-[rgba(207,194,212,0.2)] pt-4 flex items-center justify-between">
        <span className="text-[#500088] font-bold text-base">{formatPriceRange(service.price_min, service.price_max)}</span>
        <div className="flex gap-2">
          <a href={`/marketplace/service/${service.id}`} className="border border-[#cfc2d4] text-[#1c1c18] text-sm font-medium px-3 py-2 rounded-xl hover:border-[#500088] transition-colors no-underline">
            View
          </a>
          <button onClick={() => onBook(service.id)} className="text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 active:scale-95" style={{ background: "#500088" }}>
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [budgetMax, setBudgetMax] = useState(10000);
  const [activeRating, setActiveRating] = useState("All Ratings");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoading(true);
      setNotice("");
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.set("category", activeCategory);
        if (selectedLocation !== "All Locations") params.set("location", selectedLocation);
        params.set("max_price", String(budgetMax));
        const payload = await apiRequest(`/services?${params.toString()}`);
        if (cancelled) return;
        setServices(Array.isArray(payload) ? payload : []);
      } catch (err) {
        if (cancelled) return;
        setServices([]);
        setNotice(err?.message || "Could not load marketplace listings right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, selectedLocation, budgetMax]);

  const ratingFilteredServices = useMemo(() => {
    if (activeRating === "All Ratings") return services;
    if (activeRating === "5.0") return services.filter((item) => Number(item.rating || 0) >= 5.0);
    return services.filter((item) => Number(item.rating || 0) >= 4.5);
  }, [services, activeRating]);

  const visibleServices = ratingFilteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < ratingFilteredServices.length;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(6);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setVisibleCount(6);
  };

  const handleBudgetChange = (event) => {
    setBudgetMax(Number(event.target.value));
    setVisibleCount(6);
  };

  const handleRatingChange = (rating) => {
    setActiveRating(rating);
    setVisibleCount(6);
  };

  const handleBook = async (serviceId) => {
    try {
      await apiRequest(`/services/${serviceId}/book`, {
        method: "POST",
        body: JSON.stringify({ message: "Hi, I would like to book this service." }),
      });
      setNotice("Booking request sent successfully.");
    } catch (err) {
      setNotice(err?.message || "Could not create booking request.");
    }

    window.setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <Navbar active="Marketplace" />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-12">
          <div data-aos="fade-down" className="relative overflow-hidden bg-[#500088] rounded-3xl p-12 flex flex-col gap-4">
            <img src={marketplaceHeroImage} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(80,0,136,0.92)] to-[rgba(80,0,136,0.85)]" />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[rgba(133,83,0,0.15)]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[rgba(107,0,62,0.15)]" />
            <div className="relative z-10">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-5xl lg:text-7xl leading-tight inline-flex items-center gap-3">
                <ShoppingBag size={44} strokeWidth={1.5} /> Find a Queen. Hire a Queen.
              </h1>
              <p className="text-[#d7a8ff] text-xl mt-4 max-w-[600px]">
                Browse skilled women near you ready to serve. Every queen on SheEarns is verified and ready to work.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                    activeCategory === cat ? "bg-[#500088] text-white shadow-md" : "bg-white border border-[#cfc2d4] text-[#1c1c18] hover:border-[#500088]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select value={selectedLocation} onChange={handleLocationChange} className="bg-white border border-[#e6e2dc] text-[#1c1c18] text-sm px-4 py-3 rounded-xl outline-none cursor-pointer">
                <option>All Locations</option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Nakuru</option>
                <option>Eldoret</option>
                <option>Thika</option>
              </select>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-[#4c4452]">
                  <span className="font-bold uppercase tracking-widest">Budget</span>
                  <span className="font-bold">Ksh 0 - {budgetMax.toLocaleString()}</span>
                </div>
                <input type="range" min="0" max="20000" step="500" value={budgetMax} onChange={handleBudgetChange} className="accent-[#500088]" />
              </div>
              <div className="flex gap-3">
                {["All Ratings", "4.5+", "5.0"].map((r) => (
                  <button key={r} onClick={() => handleRatingChange(r)} className={`flex-1 border text-[#1c1c18] text-sm py-3 rounded-xl transition-colors ${activeRating === r ? "bg-[rgba(80,0,136,0.08)] border-[#500088]" : "bg-white border-[#e6e2dc] hover:border-[#500088]"}`}>
                    <span className="inline-flex items-center gap-1">
                      {r === "All Ratings" ? "All" : <><Star size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" /> {r}</>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} onBook={handleBook} />
            ))}

            {!loading && visibleServices.length === 0 && (
              <div className="col-span-3 flex flex-col items-center gap-4 py-20 text-center">
                <div className="bg-[rgba(80,0,136,0.06)] w-20 h-20 rounded-full flex items-center justify-center">
                  <SearchX size={32} className="text-[#500088]" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl">
                  No services found for this filter
                </h3>
                <p className="text-[#4c4452] text-sm max-w-xs">
                  Try changing location, budget, or category.
                </p>
                <a href="/signup" className="bg-[#500088] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity no-underline">
                  Join as a Queen
                </a>
              </div>
            )}
          </div>

          {loading && (
            <p className="text-center text-[#4c4452] text-sm">Loading marketplace services...</p>
          )}

          {notice && (
            <p className="text-center text-sm text-[#500088] font-semibold">{notice}</p>
          )}

          <div className="flex justify-center">
            {hasMore ? (
              <button onClick={() => setVisibleCount((prev) => prev + 3)} className="border-2 border-[#cfc2d4] text-[#1c1c18] font-bold text-base px-10 py-4 rounded-2xl hover:border-[#500088] hover:text-[#500088] transition-all duration-200 active:scale-95 flex items-center gap-2">
                Load More Queens <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            ) : (
              <p className="text-[#4c4452] text-sm text-center">You've seen all our Queens! More joining soon.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
