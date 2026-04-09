import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MapPin,
  Star,
  BadgeCheck,
  MessageCircle,
  ArrowRight,
  Camera,
} from "lucide-react";
import { apiRequest } from "../api";

const fallbackAvatar = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&q=80&auto=format&fit=crop";

function formatPriceRange(min, max) {
  const safeMin = Number(min || 0);
  const safeMax = Number(max || 0);
  if (safeMax > safeMin) {
    return `Ksh ${safeMin.toLocaleString()} - ${safeMax.toLocaleString()}`;
  }
  return `From Ksh ${safeMin.toLocaleString()}`;
}

function buildWhatsAppLink(phone, providerName, serviceTitle) {
  const raw = String(phone || "").trim();
  if (!raw) return null;

  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 10 && digits.startsWith("0")) {
    digits = `254${digits.slice(1)}`;
  }

  const message = encodeURIComponent(
    `Hi ${providerName || "there"}, I found your ${serviceTitle || "service"} on SheEarns and I would like to book.`
  );
  return `https://wa.me/${digits}?text=${message}`;
}

export default function QueenProfile({ serviceId }) {
  const [service, setService] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadService() {
      setLoading(true);
      setNotice("");

      try {
        const payload = await apiRequest(`/services/${serviceId}`);
        if (cancelled) return;
        setService(payload);

        const relatedPayload = await apiRequest(`/services?category=${encodeURIComponent(payload.category)}`);
        if (cancelled) return;
        const allServicesPayload = await apiRequest("/services");
        if (cancelled) return;

        const allServices = Array.isArray(allServicesPayload) ? allServicesPayload : [];
        const ownServices = allServices.filter((item) => item.user_id === payload.user_id);
        setProviderServices(ownServices.length ? ownServices : [payload]);

        const related = Array.isArray(relatedPayload)
          ? relatedPayload.filter((item) => item.id !== payload.id && item.user_id !== payload.user_id).slice(0, 3)
          : [];
        setSimilar(related);
      } catch (err) {
        if (cancelled) return;
        setService(null);
        setProviderServices([]);
        setNotice(err?.message || "Could not load this profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadService();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const reviews = useMemo(() => service?.reviews || [], [service]);
  const whatsappLink = useMemo(
    () => buildWhatsAppLink(service?.provider_phone, service?.provider_name, service?.title),
    [service?.provider_phone, service?.provider_name, service?.title]
  );

  const handleBook = async () => {
    if (!service?.id) return;
    setBooking(true);
    try {
      await apiRequest(`/services/${service.id}/book`, {
        method: "POST",
        body: JSON.stringify({ message: "Hi, I would like to book this service." }),
      });
      setNotice("Booking request sent successfully.");
    } catch (err) {
      setNotice(err?.message || "Could not send booking request.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Marketplace" isLoggedIn={false} />

      <main className="pt-28 pb-24">
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(80,0,136,0.85)]" />
            </div>
            <div className="-mt-16 ml-8 relative z-10">
              <img
                src={service?.portfolio_urls?.[0] || fallbackAvatar}
                alt={service?.provider_name || "Provider"}
                loading="lazy"
                className="w-32 h-32 rounded-full object-cover object-top border-4 border-white shadow-xl"
              />
            </div>
            <div className="p-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-3xl">{service?.provider_name || "SheEarns Queen"}</h2>
                  <BadgeCheck size={20} strokeWidth={1.5} className="text-[#500088]" />
                </div>
                <p className="text-[#1c1c18] font-semibold">{service?.title || "Service"}</p>
                <p className="text-[#4c4452] inline-flex items-center gap-1 text-sm mt-1"><MapPin size={14} strokeWidth={1.5} /> {service?.location || "-"}</p>
                <p className="inline-flex items-center gap-1 text-sm mt-2 text-[#500088] font-bold">
                  <Star size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
                  {(service?.rating || 0).toFixed(1)} ({service?.review_count || 0} reviews)
                </p>
                <p className="text-[#500088] font-bold text-base mt-2">{formatPriceRange(service?.price_min, service?.price_max)}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleBook} disabled={booking} className="bg-[#500088] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">{booking ? "Sending..." : "Book Now"}</button>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95 inline-flex items-center gap-2 no-underline"
                  >
                    <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => setNotice("This provider has not added a WhatsApp number yet.")}
                    className="bg-green-600 text-white font-bold px-6 py-3 rounded-2xl opacity-70 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <MessageCircle size={16} strokeWidth={1.5} /> WhatsApp
                  </button>
                )}
              </div>
            </div>
            {notice && <p className="text-sm font-semibold text-[#500088] mt-4">{notice}</p>}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-2xl mb-4">About</h3>
              <p className="text-[#4c4452] leading-relaxed">{service?.description || "No description yet."}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-2xl mb-4">Services Offered</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {providerServices.map((item) => (
                  <div key={item.id} className={`rounded-2xl p-4 border ${item.id === service?.id ? "bg-[rgba(80,0,136,0.08)] border-[#500088]" : "bg-[#f7f3ed] border-transparent"}`}>
                    <p className="font-semibold text-[#1c1c18]">{item.title}</p>
                    <p className="text-[#500088] font-bold mt-1">{formatPriceRange(item.price_min, item.price_max)}</p>
                    <p className="text-[#4c4452] text-xs mt-1">{item.category}</p>
                    {item.id !== service?.id && (
                      <a href={`/marketplace/service/${item.id}`} className="inline-block mt-2 text-[#500088] text-xs font-bold no-underline hover:underline">
                        View this service
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-2xl mb-4 inline-flex items-center gap-2">
                <Camera size={22} strokeWidth={1.5} /> Portfolio
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(service?.portfolio_urls?.length ? service.portfolio_urls : [fallbackAvatar]).map((img) => (
                  <img key={img} src={img} alt="Service portfolio work" loading="lazy" className="w-full h-40 rounded-2xl object-cover object-center" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-2xl mb-4">Reviews</h3>
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-[#4c4452] text-sm">No reviews yet for this service.</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="bg-[#f7f3ed] rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-[#1c1c18]">{review.reviewer_name}</p>
                      <p className="text-xs text-[#4c4452]">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="flex items-center gap-1 mt-1">
                      {Array.from({ length: Number(review.rating || 0) }).map((_, i) => (
                        <Star key={i} size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
                      ))}
                    </p>
                    <p className="text-[#4c4452] text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-xl mb-4">Similar Queens</h3>
              <div className="space-y-4">
                {similar.map((item) => (
                  <a key={item.id} href={`/marketplace/service/${item.id}`} className="no-underline bg-[#f7f3ed] rounded-2xl p-3 flex items-center gap-3">
                    <img src={item.portfolio_urls?.[0] || fallbackAvatar} alt={`${item.provider_name || "Provider"} profile`} loading="lazy" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-[#1c1c18] text-sm">{item.provider_name || "SheEarns Queen"}</p>
                      <p className="text-[#4c4452] text-xs">{item.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <a href="/marketplace" className="bg-[#500088] text-white font-bold px-5 py-4 rounded-2xl no-underline inline-flex items-center gap-2 hover:opacity-90 transition-all duration-200 active:scale-95">
              Back to Marketplace <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </section>

        {loading && <p className="text-center text-[#4c4452] text-sm">Loading profile...</p>}
      </main>

      <Footer />
    </div>
  );
}
