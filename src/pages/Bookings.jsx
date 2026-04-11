import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

function statusBadge(status) {
  const normalized = String(status || "pending").toLowerCase();
  if (normalized === "completed") return "bg-green-100 text-green-700";
  if (normalized === "accepted") return "bg-blue-100 text-blue-700";
  if (normalized === "rejected") return "bg-red-100 text-red-700";
  if (normalized === "cancelled") return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-700";
}

export default function Bookings() {
  const { isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setNotice("");
      try {
        const payload = await apiRequest("/services/bookings/me");
        if (cancelled) return;
        setBookings(Array.isArray(payload) ? payload : []);
      } catch (err) {
        if (cancelled) return;
        setNotice(err?.message || "Could not load your bookings right now.");
        setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (isLoggedIn) {
      loadBookings();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Marketplace" />

      <main className="pt-28 px-6 pb-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#500088]">My Bookings</h1>
          <p className="text-[#4c4452] mt-2">Track all your service requests and current status.</p>

          {!isLoggedIn && (
            <p className="text-[#4c4452] mt-6">Please log in to view your bookings.</p>
          )}

          {loading && <p className="text-[#4c4452] mt-6">Loading your bookings...</p>}
          {notice && <p className="text-[#500088] mt-6 font-semibold">{notice}</p>}

          {!loading && isLoggedIn && !bookings.length && (
            <p className="text-[#4c4452] mt-6">No bookings yet. Explore the marketplace and book a service.</p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-[#f7f3ed] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#1c1c18] text-sm">{booking.service_title || "Service"}</p>
                    <p className="text-[#4c4452] text-xs">Provider: {booking.provider_name || "Unknown"}</p>
                    <p className="text-[#4c4452] text-xs">Amount: Ksh {Number(booking.amount || 0).toLocaleString()}</p>
                    <p className="text-[#4c4452] text-xs">
                      Requested on {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge(booking.status)}`}>
                    {String(booking.status || "pending").toLowerCase()}
                  </span>
                </div>
                {booking.message && <p className="text-[#4c4452] text-xs mt-3">"{booking.message}"</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
