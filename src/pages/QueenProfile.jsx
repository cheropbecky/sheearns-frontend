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
  ShieldCheck,
  X,
  CheckCircle2,
  Send,
} from "lucide-react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

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
  const { isLoggedIn, user } = useAuth();
  const [service, setService] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [bookingService, setBookingService] = useState(null);
  const [bookingNote, setBookingNote] = useState("Hi, I would like to book this service.");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [reviewName, setReviewName] = useState(user?.name || "");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewNotice, setReviewNotice] = useState("");
  const [editingReviewId, setEditingReviewId] = useState("");
  const [editingReviewRating, setEditingReviewRating] = useState(5);
  const [editingReviewComment, setEditingReviewComment] = useState("");
  const [reviewActionLoadingId, setReviewActionLoadingId] = useState("");

  useEffect(() => {
    if (user?.name && !reviewName) {
      setReviewName(user.name);
    }
  }, [user?.name, reviewName]);

  const fetchService = async () => {
    setLoading(true);
    setNotice("");

    try {
      const payload = await apiRequest(`/services/${serviceId}`);
      setService(payload);

      const [relatedPayload, allServicesPayload] = await Promise.all([
        apiRequest(`/services?category=${encodeURIComponent(payload.category)}`),
        apiRequest("/services"),
      ]);

      const allServices = Array.isArray(allServicesPayload) ? allServicesPayload : [];
      const ownServices = allServices.filter((item) => item.user_id === payload.user_id);
      setProviderServices(ownServices.length ? ownServices : [payload]);

      const related = Array.isArray(relatedPayload)
        ? relatedPayload.filter((item) => item.id !== payload.id && item.user_id !== payload.user_id).slice(0, 3)
        : [];
      setSimilar(related);
    } catch (err) {
      setService(null);
      setProviderServices([]);
      setNotice(err?.message || "Could not load this profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadService() {
      setLoading(true);
      setNotice("");

      try {
        const payload = await apiRequest(`/services/${serviceId}`);
        if (cancelled) return;
        setService(payload);

        const [relatedPayload, allServicesPayload] = await Promise.all([
          apiRequest(`/services?category=${encodeURIComponent(payload.category)}`),
          apiRequest("/services"),
        ]);
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

  const handleBook = () => {
    if (!service?.id) return;
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
      setNotice(err?.message || "Could not send booking request.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const submitReview = async () => {
    if (!service?.id) return;

    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewNotice("Please add your name and a short review.");
      return;
    }

    setReviewSubmitting(true);
    setReviewNotice("");

    try {
      await apiRequest(`/services/${service.id}/review`, {
        method: "POST",
        body: JSON.stringify({
          reviewer_name: reviewName.trim(),
          rating: Number(reviewRating),
          comment: reviewComment.trim(),
        }),
      });

      setReviewComment("");
      setReviewRating(5);
      setReviewNotice("Review submitted successfully.");
      await fetchService();
    } catch (err) {
      setReviewNotice(err?.message || "Could not submit your review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const startEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditingReviewRating(Number(review.rating || 5));
    setEditingReviewComment(String(review.comment || ""));
  };

  const cancelEditReview = () => {
    setEditingReviewId("");
    setEditingReviewRating(5);
    setEditingReviewComment("");
  };

  const saveReviewEdit = async (reviewId) => {
    if (!service?.id) return;
    if (!editingReviewComment.trim()) {
      setReviewNotice("Review comment cannot be empty.");
      return;
    }

    setReviewActionLoadingId(reviewId);
    setReviewNotice("");
    try {
      await apiRequest(`/services/${service.id}/review/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify({
          rating: Number(editingReviewRating),
          comment: editingReviewComment.trim(),
        }),
      });
      cancelEditReview();
      setReviewNotice("Review updated.");
      await fetchService();
    } catch (err) {
      setReviewNotice(err?.message || "Could not update review.");
    } finally {
      setReviewActionLoadingId("");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!service?.id) return;
    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;

    setReviewActionLoadingId(reviewId);
    setReviewNotice("");
    try {
      await apiRequest(`/services/${service.id}/review/${reviewId}`, {
        method: "DELETE",
      });
      if (editingReviewId === reviewId) {
        cancelEditReview();
      }
      setReviewNotice("Review deleted.");
      await fetchService();
    } catch (err) {
      setReviewNotice(err?.message || "Could not delete review.");
    } finally {
      setReviewActionLoadingId("");
    }
  };

  const averageRating = Number(service?.rating || 0).toFixed(1);

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
      <Navbar active="Marketplace" isLoggedIn={false} />

      <main className="pt-28 pb-24">
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-[rgba(80,0,136,0.2)] to-[rgba(80,0,136,0.9)]" />
              <div className="absolute top-5 left-5 bg-[rgba(80,0,136,0.9)] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck size={14} strokeWidth={1.8} /> Verified profile
              </div>
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
                  {averageRating} ({service?.review_count || 0} reviews)
                </p>
                <p className="text-[#500088] font-bold text-base mt-2">{formatPriceRange(service?.price_min, service?.price_max)}</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Fast response", value: "Usually replies same day" },
                    { label: "Secure booking", value: "Requests are recorded" },
                    { label: "Trust signal", value: `${service?.review_count || 0} reviews from clients` },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#f7f3ed] rounded-2xl p-3">
                      <p className="text-[11px] uppercase tracking-widest text-[#4c4452] font-bold">{item.label}</p>
                      <p className="text-sm text-[#1c1c18] font-semibold mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleBook} className="bg-[#500088] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all duration-200 active:scale-95 inline-flex items-center gap-2">
                  <Send size={16} strokeWidth={1.5} /> Book Now
                </button>
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

                    {editingReviewId === review.id ? (
                      <div className="mt-2 space-y-3">
                        <select
                          value={editingReviewRating}
                          onChange={(event) => setEditingReviewRating(Number(event.target.value))}
                          className="bg-white rounded-xl px-3 py-2 text-sm outline-none"
                        >
                          {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                          ))}
                        </select>
                        <textarea
                          value={editingReviewComment}
                          onChange={(event) => setEditingReviewComment(event.target.value)}
                          className="w-full bg-white rounded-xl px-3 py-2 text-sm outline-none resize-none"
                          rows={4}
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => saveReviewEdit(review.id)}
                            disabled={reviewActionLoadingId === review.id}
                            className="bg-[#500088] text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditReview}
                            disabled={reviewActionLoadingId === review.id}
                            className="bg-white text-[#4c4452] border border-[rgba(76,68,82,0.2)] text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="flex items-center gap-1 mt-1">
                          {Array.from({ length: Number(review.rating || 0) }).map((_, i) => (
                            <Star key={i} size={14} strokeWidth={1.5} className="text-[#fea619] fill-[#fea619]" />
                          ))}
                        </p>
                        <p className="text-[#4c4452] text-sm mt-2">{review.comment}</p>
                      </>
                    )}

                    {(user?.id && (review.reviewer_user_id === user.id || service?.user_id === user.id)) && editingReviewId !== review.id && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => startEditReview(review)}
                          disabled={reviewActionLoadingId === review.id}
                          className="bg-white text-[#4c4452] border border-[rgba(76,68,82,0.2)] text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={reviewActionLoadingId === review.id}
                          className="bg-[#e96a4b] text-white text-xs font-bold px-3 py-2 rounded-xl disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#500088] text-2xl mb-4">Leave a Review</h3>
              <p className="text-[#4c4452] text-sm mb-4">Share your experience so other clients can book with confidence.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-[#1c1c18]">Your name</span>
                  <input
                    value={reviewName}
                    onChange={(event) => setReviewName(event.target.value)}
                    className="bg-[#f7f3ed] rounded-2xl px-4 py-3 outline-none"
                    placeholder="Your name"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-[#1c1c18]">Rating</span>
                  <select
                    value={reviewRating}
                    onChange={(event) => setReviewRating(Number(event.target.value))}
                    className="bg-[#f7f3ed] rounded-2xl px-4 py-3 outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 mt-4">
                <span className="text-sm font-bold text-[#1c1c18]">Your review</span>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={5}
                  className="bg-[#f7f3ed] rounded-2xl px-4 py-3 outline-none resize-none"
                  placeholder="Tell others what it was like working with this queen"
                />
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                <p className="text-xs text-[#4c4452]">Reviews are public and help improve trust on the marketplace.</p>
                <button
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className="bg-[#500088] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-70 inline-flex items-center gap-2"
                >
                  <Send size={15} strokeWidth={1.8} /> {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>

              {reviewNotice && <p className="text-sm font-semibold text-[#500088] mt-4">{reviewNotice}</p>}
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

      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 bg-[rgba(28,28,24,0.58)] px-4 py-8 flex items-end sm:items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[rgba(207,194,212,0.2)] flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#855300]">Booking sent</p>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl mt-1">Your request is in the queue</h2>
                <p className="text-sm text-[#4c4452] mt-2">
                  {bookingConfirmation.providerName || "This queen"} can review your request and get back to you.
                </p>
              </div>
              <button onClick={() => setBookingConfirmation(null)} className="text-[#4c4452] hover:text-[#500088]">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Service</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{bookingConfirmation.serviceTitle}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Estimated amount</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">Ksh {Number(bookingConfirmation.amount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Status</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1 inline-flex items-center gap-2"><CheckCircle2 size={15} className="text-green-600" /> Pending review</p>
                </div>
              </div>

              <p className="text-sm text-[#4c4452]">
                Next step: wait for a reply, or use WhatsApp if the provider has a number listed.
              </p>

              <div className="flex justify-end">
                <button onClick={() => setBookingConfirmation(null)} className="bg-[#500088] text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-opacity">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingService && (
        <div className="fixed inset-0 z-50 bg-[rgba(28,28,24,0.58)] px-4 py-8 flex items-end sm:items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[rgba(207,194,212,0.2)] flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#855300]">Booking request</p>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl mt-1">Confirm your request</h2>
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
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Service</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{bookingService.title}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Location</p>
                  <p className="text-sm font-bold text-[#1c1c18] mt-1">{bookingService.location}</p>
                </div>
                <div className="bg-[#f7f3ed] rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-[#4c4452] font-bold">Budget</p>
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
