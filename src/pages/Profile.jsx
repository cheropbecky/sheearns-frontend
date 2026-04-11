import { useEffect, useMemo, useState } from "react";
import { Camera, Plus, Save, Trash2, UserRound, PencilLine, X, ArrowRight, BadgeCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";

const defaultServices = ["Hair Braiding", "Home Service Styling"];
const marketplaceCategories = [
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

export default function Profile() {
  const { user, updateUser, isLoggedIn } = useAuth();
  const [newService, setNewService] = useState("");
  const [servicesDraft, setServicesDraft] = useState(user?.services || defaultServices);
  const [avatarDraft, setAvatarDraft] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [listingCategory, setListingCategory] = useState("Hair & Beauty");
  const [listingDescription, setListingDescription] = useState("");
  const [listingLocation, setListingLocation] = useState(user?.location || "Nairobi");
  const [listingMinPrice, setListingMinPrice] = useState(1000);
  const [listingMaxPrice, setListingMaxPrice] = useState(3000);
  const [portfolioUrlsText, setPortfolioUrlsText] = useState("");
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsNotice, setListingsNotice] = useState("");
  const [editingListingId, setEditingListingId] = useState("");
  const [editingListingDraft, setEditingListingDraft] = useState(null);
  const [savingListingId, setSavingListingId] = useState("");
  const [deletingListingId, setDeletingListingId] = useState("");
  const services = useMemo(() => servicesDraft, [servicesDraft]);

  const loadListings = async () => {
    setListingsLoading(true);
    try {
      const payload = await apiRequest("/services/me");
      setMyListings(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setListingsNotice(err?.message || "Could not load your listings right now.");
      setMyListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  const startEditingListing = (listing) => {
    setEditingListingId(listing.id);
    setEditingListingDraft({
      title: listing.title || "",
      category: listing.category || "Hair & Beauty",
      description: listing.description || "",
      location: listing.location || "Nairobi",
      price_min: String(listing.price_min ?? 0),
      price_max: String(listing.price_max ?? 0),
      portfolio_urls: Array.isArray(listing.portfolio_urls) ? listing.portfolio_urls.join("\n") : "",
      is_active: listing.is_active ?? true,
    });
  };

  const cancelEditingListing = () => {
    setEditingListingId("");
    setEditingListingDraft(null);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    async function loadProfile() {
      try {
        const payload = await apiRequest("/users/me");
        if (cancelled) return;

        const mapped = {
          id: payload?.id || user?.id || null,
          name: payload?.full_name || user?.name || "Queen",
          email: payload?.email || user?.email || "",
          avatar: payload?.avatar_url || null,
          services: payload?.services || [],
          notificationsEnabled: payload?.notifications_enabled ?? true,
          marketingEmailsEnabled: payload?.marketing_emails_enabled ?? false,
        };
        updateUser(mapped);
        setAvatarDraft(mapped.avatar || "");
        setServicesDraft(mapped.services.length ? mapped.services : defaultServices);
        setListingLocation(payload?.location || user?.location || "Nairobi");
      } catch {
        // Keep local state if backend fetch fails.
      }
    }

    loadProfile();
      loadListings();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      setAvatarDraft(value);
    };
    reader.readAsDataURL(file);
  };

  const handleAddService = () => {
    const value = newService.trim();
    if (!value) return;

    setServicesDraft((currentServices) => {
      if (currentServices.includes(value)) return currentServices;
      return [...currentServices, value];
    });
    setNewService("");
  };

  const handleRemoveService = (service) => {
    setServicesDraft((currentServices) => currentServices.filter((item) => item !== service));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setNotice("");
    try {
      const payload = await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          avatar_url: avatarDraft || null,
          services: servicesDraft,
        }),
      });

      updateUser({
        id: payload?.id || user?.id || null,
        name: payload?.full_name || user?.name || "Queen",
        email: payload?.email || user?.email || "",
        avatar: payload?.avatar_url || null,
        services: payload?.services || servicesDraft,
        notificationsEnabled: payload?.notifications_enabled ?? true,
        marketingEmailsEnabled: payload?.marketing_emails_enabled ?? false,
      });

      setNotice("Profile saved successfully.");
    } catch (err) {
      setNotice(err?.message || "Could not save profile right now.");
    } finally {
      setSaving(false);
      window.setTimeout(() => setNotice(""), 3000);
    }
  };

  const handlePublishListing = async () => {
    if (!listingTitle.trim() || !listingDescription.trim() || !listingLocation.trim()) {
      setNotice("Please fill title, description, and location before publishing.");
      return;
    }

    if (Number(listingMinPrice) <= 0 || Number(listingMaxPrice) <= 0) {
      setNotice("Please set valid prices greater than zero.");
      return;
    }

    if (Number(listingMinPrice) > Number(listingMaxPrice)) {
      setNotice("Minimum price cannot be greater than maximum price.");
      return;
    }

    setPublishing(true);
    setNotice("");

    try {
      const portfolioUrls = portfolioUrlsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      await apiRequest("/services", {
        method: "POST",
        body: JSON.stringify({
          title: listingTitle.trim(),
          category: listingCategory,
          description: listingDescription.trim(),
          price_min: Number(listingMinPrice),
          price_max: Number(listingMaxPrice),
          location: listingLocation.trim(),
          portfolio_urls: portfolioUrls,
        }),
      });

      setNotice("Listing published. You can now find yourself in Marketplace.");
      setListingTitle("");
      setListingDescription("");
      setPortfolioUrlsText("");
      window.setTimeout(() => {
        window.history.pushState({}, "", "/marketplace");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, 700);
    } catch (err) {
      setNotice(err?.message || "Could not publish listing right now.");
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveListing = async (listingId) => {
    if (!editingListingDraft) return;

    if (!editingListingDraft.title.trim() || !editingListingDraft.description.trim() || !editingListingDraft.location.trim()) {
      setListingsNotice("Please fill title, description, and location before saving.");
      return;
    }

    const nextMin = Number(editingListingDraft.price_min);
    const nextMax = Number(editingListingDraft.price_max);

    if (nextMin <= 0 || nextMax <= 0) {
      setListingsNotice("Please set valid prices greater than zero.");
      return;
    }

    if (nextMin > nextMax) {
      setListingsNotice("Minimum price cannot be greater than maximum price.");
      return;
    }

    setSavingListingId(listingId);
    setListingsNotice("");

    try {
      const portfolioUrls = String(editingListingDraft.portfolio_urls || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      await apiRequest(`/services/${listingId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editingListingDraft.title.trim(),
          category: editingListingDraft.category,
          description: editingListingDraft.description.trim(),
          price_min: nextMin,
          price_max: nextMax,
          location: editingListingDraft.location.trim(),
          portfolio_urls: portfolioUrls,
          is_active: editingListingDraft.is_active,
        }),
      });

      setListingsNotice("Listing updated successfully.");
      cancelEditingListing();
      await loadListings();
    } catch (err) {
      setListingsNotice(err?.message || "Could not update this listing right now.");
    } finally {
      setSavingListingId("");
      window.setTimeout(() => setListingsNotice(""), 3000);
    }
  };

  const handleDeleteListing = async (listingId) => {
    const confirmDelete = window.confirm("Remove this listing from the marketplace?");
    if (!confirmDelete) return;

    setDeletingListingId(listingId);
    setListingsNotice("");

    try {
      await apiRequest(`/services/${listingId}`, { method: "DELETE" });
      setListingsNotice("Listing removed from the marketplace.");
      if (editingListingId === listingId) {
        cancelEditingListing();
      }
      await loadListings();
    } catch (err) {
      setListingsNotice(err?.message || "Could not remove this listing right now.");
    } finally {
      setDeletingListingId("");
      window.setTimeout(() => setListingsNotice(""), 3000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
        <Navbar active="How It Works" />
        <main className="pt-28 px-6 pb-20">
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center">
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#500088]">Profile</h1>
            <p className="text-[#4c4452] mt-3">Please log in to edit your profile.</p>
            <a href="/login" className="inline-block mt-6 bg-[#500088] text-white px-5 py-3 rounded-2xl font-bold no-underline">Go to Login</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif] flex flex-col">
      <Navbar active="How It Works" />

      <main className="pt-28 px-6 pb-20 flex-1">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                {avatarDraft ? (
                  <img src={avatarDraft} alt="Profile" className="w-28 h-28 rounded-full object-cover" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#f1ede7] flex items-center justify-center">
                    <UserRound size={40} className="text-[#500088]" />
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 bg-[#500088] text-white p-2 rounded-full cursor-pointer">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[#1c1c18]">{user?.name || "Queen"}</h1>
              <p className="text-sm text-[#4c4452]">{user?.email || "No email added"}</p>
            </div>
          </section>

          <section className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1c1c18] mb-4">My Services</h2>
            <p className="text-[#4c4452] text-sm mb-5">Add the services you currently offer so clients can understand your strengths.</p>

            <div className="flex gap-3 mb-5">
              <input
                value={newService}
                onChange={(event) => setNewService(event.target.value)}
                placeholder="Example: Bridal Makeup"
                className="flex-1 bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
              />
              <button onClick={handleAddService} className="bg-[#500088] text-white rounded-xl px-4 py-3 inline-flex items-center gap-2 font-bold">
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <div key={service} className="inline-flex items-center gap-2 bg-[#f7f3ed] rounded-full px-4 py-2">
                  <span className="text-sm font-semibold text-[#1c1c18]">{service}</span>
                  <button onClick={() => handleRemoveService(service)} className="text-[#500088] hover:text-[#1c1c18]">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleSaveProfile} disabled={saving} className="bg-[#500088] text-white rounded-xl px-5 py-3 inline-flex items-center gap-2 font-bold disabled:opacity-70">
                <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
              </button>
              {notice && <span className="text-sm font-semibold text-[#500088]">{notice}</span>}
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(207,194,212,0.35)]">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#1c1c18] mb-2">Publish Marketplace Listing</h3>
              <p className="text-[#4c4452] text-sm mb-4">This creates a real listing in the marketplace database. Portfolio is for examples of your work, separate from your profile photo.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={listingTitle}
                  onChange={(event) => setListingTitle(event.target.value)}
                  placeholder="Service title (e.g. Bridal Makeup Artist)"
                  className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                />
                <select
                  value={listingCategory}
                  onChange={(event) => setListingCategory(event.target.value)}
                  className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                >
                  {marketplaceCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={listingDescription}
                onChange={(event) => setListingDescription(event.target.value)}
                placeholder="Describe what clients get when they book you"
                className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none min-h-24"
              />

              <textarea
                value={portfolioUrlsText}
                onChange={(event) => setPortfolioUrlsText(event.target.value)}
                placeholder="Portfolio image URLs (one per line, optional)"
                className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none min-h-20 mt-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <input
                  type="text"
                  value={listingLocation}
                  onChange={(event) => setListingLocation(event.target.value)}
                  placeholder="Location"
                  className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={listingMinPrice}
                  onChange={(event) => setListingMinPrice(event.target.value)}
                  placeholder="Min price"
                  className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={listingMaxPrice}
                  onChange={(event) => setListingMaxPrice(event.target.value)}
                  placeholder="Max price"
                  className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handlePublishListing}
                  disabled={publishing}
                  className="bg-[#1c1c18] text-white rounded-xl px-5 py-3 font-bold disabled:opacity-70"
                >
                  {publishing ? "Publishing..." : "Publish to Marketplace"}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(207,194,212,0.35)]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#1c1c18] inline-flex items-center gap-2">
                    <BadgeCheck size={18} className="text-[#500088]" /> My Listings
                  </h3>
                  <p className="text-[#4c4452] text-sm mt-1">Manage your marketplace services, pricing, and portfolio from one place.</p>
                </div>
                <button onClick={loadListings} className="text-sm font-bold text-[#500088] inline-flex items-center gap-2 self-start sm:self-auto hover:underline">
                  Refresh listings <ArrowRight size={14} />
                </button>
              </div>

              {listingsNotice && <p className="text-sm font-semibold text-[#500088] mb-4">{listingsNotice}</p>}

              {listingsLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="bg-[#f7f3ed] rounded-3xl p-5 animate-pulse">
                      <div className="h-5 w-1/2 bg-[#e6e2dc] rounded mb-3" />
                      <div className="h-4 w-2/3 bg-[#e6e2dc] rounded mb-2" />
                      <div className="h-4 w-1/3 bg-[#e6e2dc] rounded" />
                    </div>
                  ))}
                </div>
              ) : myListings.length === 0 ? (
                <div className="bg-[#f7f3ed] rounded-3xl p-6 text-sm text-[#4c4452]">
                  You do not have any active marketplace listings yet. Publish one above to start selling.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myListings.map((listing) => {
                    const isEditing = editingListingId === listing.id;
                    return (
                      <div key={listing.id} className="border border-[rgba(207,194,212,0.35)] rounded-3xl p-5 bg-white shadow-sm">
                        {!isEditing ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-[#1c1c18] text-lg">{listing.title}</h4>
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${listing.is_active ? "bg-[rgba(22,163,74,0.12)] text-green-700" : "bg-[rgba(220,38,38,0.12)] text-red-700"}`}>
                                    {listing.is_active ? "Active" : "Inactive"}
                                  </span>
                                </div>
                                <p className="text-[#500088] text-sm font-semibold mt-1">{listing.category}</p>
                                <p className="text-[#4c4452] text-sm mt-1">{listing.location}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-[#500088]">{Number(listing.price_min || 0).toLocaleString()} - {Number(listing.price_max || 0).toLocaleString()}</p>
                                <p className="text-xs text-[#4c4452]">Ksh pricing range</p>
                              </div>
                            </div>

                            <p className="text-sm text-[#4c4452] leading-relaxed">{listing.description}</p>

                            <div className="flex flex-wrap gap-3">
                              <button onClick={() => startEditingListing(listing)} className="inline-flex items-center gap-2 border border-[#cfc2d4] text-[#1c1c18] px-4 py-2.5 rounded-xl text-sm font-bold hover:border-[#500088] transition-colors">
                                <PencilLine size={16} /> Edit listing
                              </button>
                              <button onClick={() => handleDeleteListing(listing.id)} disabled={deletingListingId === listing.id} className="inline-flex items-center gap-2 bg-[#1c1c18] text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-70">
                                <Trash2 size={16} /> {deletingListingId === listing.id ? "Removing..." : "Remove"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="font-bold text-[#1c1c18] text-lg">Editing listing</h4>
                              <button onClick={cancelEditingListing} className="text-[#4c4452] hover:text-[#500088] inline-flex items-center gap-1 text-sm font-bold">
                                <X size={16} /> Cancel
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                value={editingListingDraft.title}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, title: event.target.value }))}
                                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                                placeholder="Service title"
                              />
                              <select
                                value={editingListingDraft.category}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, category: event.target.value }))}
                                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                              >
                                {marketplaceCategories.map((category) => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>

                            <textarea
                              value={editingListingDraft.description}
                              onChange={(event) => setEditingListingDraft((current) => ({ ...current, description: event.target.value }))}
                              className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none min-h-24"
                              placeholder="Describe the service"
                            />

                            <textarea
                              value={editingListingDraft.portfolio_urls}
                              onChange={(event) => setEditingListingDraft((current) => ({ ...current, portfolio_urls: event.target.value }))}
                              className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none min-h-20"
                              placeholder="Portfolio URLs, one per line"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                value={editingListingDraft.location}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, location: event.target.value }))}
                                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                                placeholder="Location"
                              />
                              <input
                                type="number"
                                min="0"
                                value={editingListingDraft.price_min}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, price_min: event.target.value }))}
                                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                                placeholder="Minimum price"
                              />
                              <input
                                type="number"
                                min="0"
                                value={editingListingDraft.price_max}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, price_max: event.target.value }))}
                                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                                placeholder="Maximum price"
                              />
                            </div>

                            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1c18]">
                              <input
                                type="checkbox"
                                checked={editingListingDraft.is_active}
                                onChange={(event) => setEditingListingDraft((current) => ({ ...current, is_active: event.target.checked }))}
                              />
                              Keep listing active in marketplace
                            </label>

                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => handleSaveListing(listing.id)}
                                disabled={savingListingId === listing.id}
                                className="bg-[#500088] text-white rounded-xl px-5 py-3 inline-flex items-center gap-2 font-bold disabled:opacity-70"
                              >
                                <Save size={16} /> {savingListingId === listing.id ? "Saving..." : "Save Changes"}
                              </button>
                              <button onClick={cancelEditingListing} className="border border-[#cfc2d4] text-[#1c1c18] rounded-xl px-5 py-3 font-bold hover:border-[#500088] transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
