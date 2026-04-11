import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MapPin,
  Star,
  BadgeCheck,
  ShoppingBag,
  ArrowRight,
  SearchX,
  Search,
  SlidersHorizontal,
  X,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { imageOne, imageFive, avatarPool } from "../assets/localImages";

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

const marketplaceHeroImage = imageOne;

const fallbackAvatar = imageFive;

const queenFallbackAvatars = avatarPool;

function formatPriceRange(min, max) {
  const safeMin = Number(min || 0);
  const safeMax = Number(max || 0);
  if (safeMax > safeMin) {
    return `Ksh ${safeMin.toLocaleString()} - ${safeMax.toLocaleString()}`;
  }
  return `From Ksh ${safeMin.toLocaleString()}`;
}

function ServiceCard({ service, index, onBook }) {
  const avatar = service.avatar_url || service.provider_avatar_url || service.avatar || service.portfolio_urls?.[0] || queenFallbackAvatars[index % queenFallbackAvatars.length] || fallbackAvatar;

  return (
    <div data-aos="fade-up" data-aos-delay={index * 100} className="bg-white rounded-3xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-[rgba(80,0,136,0.2)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <img src={avatar} alt={service.provider_name || "Provider"} loading="lazy" className="w-16 h-16 rounded-2xl object-cover object-top shrink-0" />
        <div className="flex items-center gap-1 bg-[rgba(80,0,136,0.05)] px-2 py-1 rounded-full">
          <Star size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
          <span className="text-[#500088] text-sm font-bold">{service.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-[#4c4452] text-xs">({service.review_count || 0})</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-sm md:text-base">{service.provider_name || "SheEarns Queen"}</h3>
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
          <button
            onClick={() => onBook(service)}
            className="text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 active:scale-95 inline-flex items-center gap-1"
            style={{ background: "#500088" }}
          >
            <MessageCircle size={14} strokeWidth={1.8} /> Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { isLoggedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [budgetMax, setBudgetMax] = useState(20000);
  const [activeRating, setActiveRating] = useState("All Ratings");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [bookingService, setBookingService] = useState(null);
  const [bookingNote, setBookingNote] = useState("Hi, I would like to book this service.");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

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
        if (debouncedSearchTerm.trim()) params.set("q", debouncedSearchTerm.trim());
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
  }, [activeCategory, selectedLocation, budgetMax, debouncedSearchTerm]);

  const ratingFilteredServices = useMemo(() => {
    if (activeRating === "All Ratings") return services;
    if (activeRating === "5.0") return services.filter((item) => Number(item.rating || 0) >= 5.0);
    return services.filter((item) => Number(item.rating || 0) >= 4.5);
  }, [services, activeRating]);

  const visibleServices = ratingFilteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < ratingFilteredServices.length;
  const activeFilterCount = [
    activeCategory !== "All",
    selectedLocation !== "All Locations",
    budgetMax < 20000,
    activeRating !== "All Ratings",
    searchTerm.trim().length > 0,
  ].filter(Boolean).length;

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setVisibleCount(6);
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedLocation("All Locations");
    setBudgetMax(20000);
    setActiveRating("All Ratings");
    setSearchTerm("");
    setVisibleCount(6);
  };

  const handleBook = (service) => {
    if (!isLoggedIn) {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    setBookingService(service);
    setBookingNote(`Hi ${service.provider_name || "there"}, I would like to book your ${service.title || "service"}.`);
  };

  const submitBooking = async () => {
    if (!bookingService?.id) return;

    setBookingSubmitting(true);
    setNotice("");

    try {
      const payload = await apiRequest(`/services/${bookingService.id}/book`, {
        method: "POST",
        body: JSON.stringify({ message: bookingNote.trim() || "Hi, I would like to book this service." }),
      });
      setBookingConfirmation({
        serviceTitle: bookingService.title,
        providerName: bookingService.provider_name,
        amount: payload?.amount ?? bookingService.price_min ?? 0,
      });
      setBookingService(null);
      setBookingNote("Hi, I would like to book this service.");
    } catch (err) {
      setNotice(err?.message || "Could not create booking request.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const resultTitle = searchTerm.trim()
    ? `Search results for “${searchTerm.trim()}”`
    : activeFilterCount > 0
      ? "Filtered queens"
      : "Featured queens";

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <Navbar active="Marketplace" />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div data-aos="fade-down" className="relative overflow-hidden bg-[#500088] rounded-3xl h-100 sm:h-125 md:h-140 p-8 sm:p-10 md:p-12 flex flex-col justify-end gap-4">
            <img src={marketplaceHeroImage} alt="" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-br from-[rgba(80,0,136,0.68)] to-[rgba(80,0,136,0.58)]" />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[rgba(133,83,0,0.15)]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[rgba(107,0,62,0.15)]" />
            <div className="relative z-10">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl sm:text-5xl lg:text-7xl leading-tight inline-flex items-center gap-3">
               Find a Queen. Hire a Queen.
              </h1>
              <p className="text-[#d7a8ff] font-bold text-sm md:text-base mt-4 max-w-150">
                Browse skilled women near you ready to serve. Every queen on SheEarns is verified and ready to work.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[rgba(207,194,212,0.2)] flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search size={18} strokeWidth={1.7} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c4452]" />
                  <input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name, service, skill, location, or description"
                    className="w-full bg-[#f7f3ed] text-[#1c1c18] text-sm sm:text-base pl-11 pr-12 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c4452] hover:text-[#500088]"
                      aria-label="Clear search"
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 bg-[rgba(80,0,136,0.08)] text-[#500088] px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap">
                    <SlidersHorizontal size={16} strokeWidth={1.7} /> {ratingFilteredServices.length} matches
                  </div>
                  <button
                    onClick={clearFilters}
                    className="border border-[#cfc2d4] text-[#1c1c18] text-sm font-bold px-4 py-3 rounded-2xl hover:border-[#500088] transition-colors whitespace-nowrap"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#4c4452]">
                <span className="font-semibold">Search and filter across titles, names, and descriptions.</span>
                <span className="font-semibold">{resultTitle}</span>
              </div>
            </div>

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
                  <span className="font-bold uppercase tracking-wide sm:tracking-widest">Budget</span>
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

          {bookingConfirmation && (
            <div className="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/10 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-[#1c1c18]">Booking request sent</p>
                  <p className="text-sm text-[#4c4452]">
                    Your request for {bookingConfirmation.serviceTitle} was sent successfully. {bookingConfirmation.providerName ? `${bookingConfirmation.providerName} can review it now.` : "The queen can review it now."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingConfirmation(null)}
                className="text-sm font-bold text-green-700 hover:underline self-start sm:self-auto"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-[#f1ede7]" />
                    <div className="w-16 h-6 rounded-full bg-[#f1ede7]" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 w-3/4 rounded bg-[#f1ede7]" />
                    <div className="h-4 w-1/2 rounded bg-[#f1ede7]" />
                    <div className="h-4 w-2/3 rounded bg-[#f1ede7]" />
                  </div>
                  <div className="border-t border-[rgba(207,194,212,0.2)] pt-4 flex items-center justify-between">
                    <div className="h-5 w-28 rounded bg-[#f1ede7]" />
                    <div className="flex gap-2">
                      <div className="h-9 w-16 rounded-xl bg-[#f1ede7]" />
                      <div className="h-9 w-16 rounded-xl bg-[#f1ede7]" />
                    </div>
                  </div>
                </div>
              ))}

            {visibleServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} onBook={handleBook} />
            ))}

            {!loading && visibleServices.length === 0 && (
              <div className="col-span-3 flex flex-col items-center gap-4 py-20 text-center">
                <div className="bg-[rgba(80,0,136,0.06)] w-20 h-20 rounded-full flex items-center justify-center">
                  <SearchX size={32} className="text-[#500088]" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl">
                  No queens match your current search
                </h3>
                <p className="text-[#4c4452] text-sm max-w-xs">
                  Try a broader search term, change the category, or reset the filters to see more listings.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={clearFilters} className="bg-[#500088] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity">
                    Clear Filters
                  </button>
                  <a href="/signup" className="border border-[#cfc2d4] text-[#1c1c18] font-bold text-sm px-6 py-3 rounded-2xl hover:border-[#500088] transition-colors no-underline">
                    Join as a Queen
                  </a>
                </div>
              </div>
            )}
          </div>

          {!loading && ratingFilteredServices.length > 0 && visibleServices.length > 0 && (
            <p className="text-center text-[#4c4452] text-sm">Showing {visibleServices.length} of {ratingFilteredServices.length} queens.</p>
          )}

          {notice && (
            <p className="text-center text-sm text-[#500088] font-semibold">{notice}</p>
          )}

          <div className="flex justify-center">
            {!loading && hasMore ? (
              <button onClick={() => setVisibleCount((prev) => prev + 3)} className="border-2 border-[#cfc2d4] text-[#1c1c18] font-bold text-base px-10 py-4 rounded-2xl hover:border-[#500088] hover:text-[#500088] transition-all duration-200 active:scale-95 flex items-center gap-2">
                Load More Queens <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            ) : (
              !loading && <p className="text-[#4c4452] text-sm text-center">You've seen all matching Queens. More joining soon.</p>
            )}
          </div>
        </div>
      </main>

      {bookingService && (
        <div className="fixed inset-0 z-50 bg-[rgba(28,28,24,0.58)] px-4 py-8 flex items-end sm:items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[rgba(207,194,212,0.2)] flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide sm:tracking-widest text-[#855300]">Booking request</p>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-lg sm:text-xl lg:text-2xl mt-1">Confirm your request</h2>
                <p className="text-sm text-[#4c4452] mt-2">
                  You are requesting {bookingService.title} from {bookingService.provider_name || "this queen"}.
                </p>
              </div>
              <button onClick={() => setBookingService(null)} className="text-[#4c4452] hover:text-[#500088]">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide sm:tracking-widest text-[#4c4452] font-bold">Service</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{bookingService.title}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide sm:tracking-widest text-[#4c4452] font-bold">Location</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{bookingService.location}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide sm:tracking-widest text-[#4c4452] font-bold">Budget</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{formatPriceRange(bookingService.price_min, bookingService.price_max)}</p>
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#1c1c18]">Message to the queen</span>
                <textarea
                  value={bookingNote}
                  onChange={(event) => setBookingNote(event.target.value)}
                  rows={5}
                  className="w-full bg-[#f7f3ed] text-[#1c1c18] rounded-2xl px-4 py-3 outline-none resize-none"
                  placeholder="Add any details about your booking request"
                />
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-[#4c4452]">
                  This will send a booking request for review. You can follow up later through the queen profile or WhatsApp if available.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setBookingService(null)} className="border border-[#cfc2d4] text-[#1c1c18] font-bold px-5 py-3 rounded-2xl hover:border-[#500088] transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={submitBooking}
                    disabled={bookingSubmitting}
                    className="bg-[#500088] text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-70 inline-flex items-center gap-2"
                  >
                    {bookingSubmitting ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
