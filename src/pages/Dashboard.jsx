import { useEffect, useState } from "react";
import {
  Award,
  Star,
  Flame,
  LayoutDashboard,
  Wallet,
  Lock,
  CheckCircle2,
  Bot,
  FilePenLine,
  Share2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import { imageTwo } from "../assets/localImages";

const DAILY_MOTIVATIONS = [
  {
    quote: "Small steps done consistently can build a business that changes your life.",
    note: "Show up for one clear action today, then stack the next tomorrow.",
  },
  {
    quote: "Progress beats perfection, especially when clients are waiting for your courage.",
    note: "Post your offer, reply faster, and let momentum do the heavy lifting.",
  },
  {
    quote: "The more visible you become, the easier it is for opportunity to find you.",
    note: "Share one proof-of-work today: a result, testimonial, or before/after.",
  },
  {
    quote: "Your price is not just money. It is your skill, time, and confidence.",
    note: "Protect your value by pricing clearly and communicating outcomes.",
  },
  {
    quote: "Every repeat client started as a first client who felt taken care of.",
    note: "Follow up kindly after each booking and invite one referral.",
  },
  {
    quote: "You do not need a perfect plan to start. You need a clear next move.",
    note: "Pick one growth task and finish it before you open social media.",
  },
  {
    quote: "Consistency makes you unforgettable in a crowded marketplace.",
    note: "Update your profile and services regularly so clients trust you instantly.",
  },
];

function getDailyMotivation() {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;

  for (const char of dateKey) {
    hash = (hash * 31 + char.charCodeAt(0)) % DAILY_MOTIVATIONS.length;
  }

  return DAILY_MOTIVATIONS[hash];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [providerBookings, setProviderBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingActionLoadingId, setBookingActionLoadingId] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      try {
        const [dashboardPayload, bookingsPayload] = await Promise.all([
          apiRequest("/dashboard"),
          apiRequest("/services/bookings/provider"),
        ]);
        if (cancelled) return;
        setDashboard(dashboardPayload);
        setProviderBookings(Array.isArray(bookingsPayload) ? bookingsPayload : []);
      } catch (err) {
        if (cancelled) return;
        setActionMessage(err?.message || "Could not load dashboard data right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = dashboard?.summary || { monthly_goal: 5000, earned: 0, remaining: 5000, progress_percent: 0 };
  const milestones = dashboard?.milestones || [];
  const activities = dashboard?.recent_activity || [];
  const goal = Number(user?.monthlyGoal || summary.monthly_goal || 5000);
  const earned = Number(summary.earned || 0);
  const remaining = Math.max(goal - earned, 0);
  const progress = goal > 0 ? Math.min((earned / goal) * 100, 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { label: "Good morning", emoji: "☀️" };
    if (hour < 17) return { label: "Good afternoon", emoji: "✨" };
    return { label: "Good evening", emoji: "🌙" };
  };

  const getDisplayName = (name) => {
    const cleaned = String(name || "").replace(/^Queen\s+/i, "").trim();
    if (!cleaned) return "Queen";
    return cleaned.split(/\s+/)[0];
  };

  const greeting = getGreeting();
  const firstName = getDisplayName(user?.name || "Queen Becky");
  const encouragement =
    greeting.label === "Good morning"
      ? "Let’s make today count."
      : greeting.label === "Good afternoon"
        ? "Keep the momentum going."
        : "You did well today. Rest and recharge.";
  const dailyMotivation = getDailyMotivation();

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const getStatusBadgeClass = (status) => {
    const normalized = String(status || "pending").toLowerCase();
    if (normalized === "completed") return "bg-green-100 text-green-700";
    if (normalized === "accepted") return "bg-blue-100 text-blue-700";
    if (normalized === "rejected") return "bg-red-100 text-red-700";
    if (normalized === "cancelled") return "bg-slate-200 text-slate-700";
    return "bg-amber-100 text-amber-700";
  };

  const handleUpdateBookingStatus = async (bookingId, nextStatus) => {
    setBookingActionLoadingId(bookingId);
    setActionMessage("");
    try {
      const updated = await apiRequest(`/services/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setProviderBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                ...updated,
              }
            : booking
        )
      );
      setActionMessage(`Booking marked as ${nextStatus}.`);
      window.setTimeout(() => setActionMessage(""), 2500);
    } catch (err) {
      setActionMessage(err?.message || "Could not update booking status.");
    } finally {
      setBookingActionLoadingId("");
    }
  };

  const handleHideBooking = async (bookingId) => {
    setBookingActionLoadingId(bookingId);
    setActionMessage("");
    try {
      await apiRequest(`/services/bookings/${bookingId}`, {
        method: "DELETE",
      });
      setProviderBookings((current) => current.filter((booking) => booking.id !== bookingId));
      setActionMessage("Booking hidden from the dashboard.");
      window.setTimeout(() => setActionMessage(""), 2500);
    } catch (err) {
      setActionMessage(err?.message || "Could not hide booking.");
    } finally {
      setBookingActionLoadingId("");
    }
  };

  const handleQuickAction = async (label) => {
    if (label === "Chat with AI Coach") {
      navigateTo("/ai-coach");
      return;
    }

    if (label === "Update My Services") {
      navigateTo("/profile");
      return;
    }

    if (label === "Log Income") {
      window.history.pushState({}, "", "/marketplace");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (label === "My Bookings") {
      navigateTo("/bookings");
      return;
    }

    if (label === "Share Profile") {
      const profileUrl = `${window.location.origin}/profile`;
      try {
        await navigator.clipboard.writeText(profileUrl);
        setActionMessage("Profile link copied. Share it with your clients.");
      } catch {
        setActionMessage("Could not copy automatically. Use this link: " + profileUrl);
      }

      window.setTimeout(() => setActionMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
        <Navbar active="Dashboard" isLoggedIn />

        <main className="pt-28 pb-24 px-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-aos="fade-down">
              <div>
                <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl sm:text-3xl lg:text-4xl">
                  {greeting.label}, {firstName} {greeting.emoji}
                </h1>
                <p className="text-[#4c4452] text-sm md:text-base mt-1">{encouragement}</p>
              </div>
              <div className="bg-white border border-[rgba(207,194,212,0.3)] rounded-2xl flex items-center gap-3 px-5 py-3 shadow-sm">
                <div className="bg-[#fea619] w-10 h-10 rounded-xl flex items-center justify-center">
                  <Flame size={18} strokeWidth={1.8} className="text-[#684000]" />
                </div>
                <div>
                  <p className="text-[#4c4452] text-xs font-medium">Current Streak</p>
                  <p className="text-[#500088] font-bold text-base">5-day streak</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden" data-aos="fade-up">
                  <Wallet className="absolute top-5 right-5 text-[rgba(80,0,136,0.08)]" size={80} strokeWidth={1.2} />
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg sm:text-xl lg:text-2xl">Income Tracker</h2>
                      <p className="text-[#4c4452] text-sm mt-1">April Goal: Ksh {goal.toLocaleString()}</p>
                    </div>
                    <span className="bg-[rgba(80,0,136,0.08)] text-[#500088] text-xs font-bold px-3 py-1.5 rounded-full">This Month</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#f7f3ed] rounded-2xl p-4">
                      <p className="text-[#4c4452] text-xs font-medium mb-1">Earned So Far</p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-xl sm:text-2xl lg:text-3xl">Ksh {earned.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#f7f3ed] rounded-2xl p-4">
                      <p className="text-[#4c4452] text-xs font-medium mb-1">Remaining</p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl sm:text-2xl lg:text-3xl">Ksh {remaining.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4c4452] font-medium">{Math.round(progress)}% complete</span>
                      <span className="text-[#500088] font-bold">Goal: Ksh {goal.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-[#e6e2dc] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #500088, #fea619)" }} />
                    </div>
                    <p className="text-[#4c4452] text-xs text-center">You are {Math.round(progress)}% of the way to your goal.</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm" data-aos="fade-up" data-aos-delay="80">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg sm:text-xl lg:text-2xl">Recent Activity</h2>
                    <button className="text-[#500088] text-sm font-bold hover:underline">View All</button>
                  </div>

                  <div className="flex flex-col divide-y divide-[rgba(207,194,212,0.2)]">
                    {activities.map((a, i) => (
                      <div key={i} className="flex items-center gap-4 py-4">
                        <div className="bg-[#f1ede7] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                          <Star size={18} strokeWidth={1.8} className="text-[#500088]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[#1c1c18] font-bold text-sm truncate">{a.title}</p>
                          </div>
                          <p className="text-[#4c4452] text-xs truncate">{a.subtitle}</p>
                        </div>
                        <span className="text-xs text-[#4c4452] shrink-0">{new Date(a.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}

                    {!activities.length && (
                      <p className="text-sm text-[#4c4452] py-4">No recent activity yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm" data-aos="fade-up">
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl mb-5">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Bot, label: "Chat with AI Coach" },
                      { icon: FilePenLine, label: "Update My Services" },
                      { icon: Wallet, label: "Log Income" },
                      { icon: LayoutDashboard, label: "My Bookings" },
                      { icon: Share2, label: "Share Profile" },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.label)}
                        className="bg-[#f7f3ed] flex flex-col items-center gap-2 py-5 px-3 rounded-2xl hover:bg-[rgba(80,0,136,0.06)] transition-colors shadow-sm"
                      >
                        <action.icon size={20} strokeWidth={1.8} className="text-[#500088]" />
                        <span className="text-[#1c1c18] text-xs font-bold text-center leading-tight">{action.label}</span>
                      </button>
                    ))}
                  </div>
                  {actionMessage && <p className="text-xs text-[#500088] mt-4 font-semibold">{actionMessage}</p>}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm" data-aos="fade-up" data-aos-delay="80">
                  <div className="flex items-center gap-2 mb-5">
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-xl">Milestones</h2>
                    <span className="bg-[rgba(254,166,25,0.15)] text-[#855300] text-xs font-bold px-2 py-0.5 rounded-full">{milestones.filter((m) => m.unlocked).length}/{milestones.length || 0}</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${m.unlocked ? "bg-[rgba(254,166,25,0.15)] shadow-sm" : "bg-[#f7f3ed] opacity-40"}`}>
                          <Award size={18} strokeWidth={1.8} className="text-[#500088]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {m.unlocked ? (
                            <>
                              <p className="text-[#1c1c18] font-bold text-sm">{m.label}</p>
                              <p className="text-[#4c4452] text-xs">Target: {m.target}</p>
                            </>
                          ) : (
                            <>
                              <div className="h-4 bg-[#e6e2dc] rounded-full w-3/4 mb-1" />
                              <p className="text-[#4c4452] text-xs">Target: {m.target}</p>
                            </>
                          )}
                        </div>
                        {m.unlocked ? (
                          <CheckCircle2 size={17} strokeWidth={2} className="text-green-500" />
                        ) : (
                          <Lock size={16} strokeWidth={2} className="text-[#cfc2d4]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-80 sm:h-95 md:h-110 p-8 sm:p-10 mt-6 flex items-center" data-aos="fade-up" data-aos-delay="120">
              <img
                src={imageTwo}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[rgba(80,0,136,0.68)] to-[rgba(148,0,88,0.60)]" />
              <div className="relative z-10 max-w-lg">
                <span className="bg-[rgba(254,166,25,0.25)] text-[#fea619] text-xs font-bold uppercase tracking-wide sm:tracking-widest px-3 py-1 rounded-full">
                  Daily Motivation
                </span>
                <p className="text-white font-bold text-lg sm:text-xl lg:text-2xl mt-3 leading-tight sm:leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                  "{dailyMotivation.quote}"
                </p>
                <p className="text-[#d7a8ff] text-sm mt-3">
                  {dailyMotivation.note}
                </p>
                <button
                  onClick={() => handleQuickAction("Update My Services")}
                  className="mt-4 bg-[#fea619] text-[#684000] font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-[#ffb930] transition-colors"
                >
                  Update My Services
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm" data-aos="fade-up" data-aos-delay="140">
              <div className="flex items-center justify-between mb-5 gap-3">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1c1c18] text-lg sm:text-xl lg:text-2xl">Bookings Dashboard</h2>
                <span className="bg-[rgba(80,0,136,0.08)] text-[#500088] text-xs font-bold px-3 py-1 rounded-full">
                  {providerBookings.length} total
                </span>
              </div>

              {!providerBookings.length && (
                <p className="text-[#4c4452] text-sm">No bookings yet. Once clients book your service, they will appear here.</p>
              )}

              <div className="flex flex-col gap-4">
                {providerBookings.slice(0, 8).map((booking) => {
                  const status = String(booking.status || "pending").toLowerCase();
                  return (
                    <div key={booking.id} className="bg-[#f7f3ed] rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-bold text-[#1c1c18] text-sm">{booking.service_title || "Service"}</p>
                          <p className="text-[#4c4452] text-xs">Client: {booking.customer_name || "Unknown"}</p>
                          <p className="text-[#4c4452] text-xs">Amount: Ksh {Number(booking.amount || 0).toLocaleString()}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(status)}`}>
                          {status}
                        </span>
                      </div>

                      {booking.message && <p className="text-[#4c4452] text-xs mb-3">"{booking.message}"</p>}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleHideBooking(booking.id)}
                          disabled={bookingActionLoadingId === booking.id}
                          className="bg-white text-[#4c4452] border border-[rgba(76,68,82,0.15)] text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                        >
                          Hide
                        </button>

                        {status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, "accepted")}
                              disabled={bookingActionLoadingId === booking.id}
                              className="bg-[#500088] text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, "rejected")}
                              disabled={bookingActionLoadingId === booking.id}
                              className="bg-[#e96a4b] text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {status === "accepted" && (
                          <>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
                              disabled={bookingActionLoadingId === booking.id}
                              className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")}
                              disabled={bookingActionLoadingId === booking.id}
                              className="bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {loading && <p className="text-[#4c4452] text-sm">Loading your dashboard...</p>}
          </div>
        </main>

        <Footer />
    </div>
  );
}
