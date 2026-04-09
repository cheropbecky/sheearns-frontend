import { useEffect, useMemo, useState } from "react";
import { Camera, Plus, Save, Trash2, UserRound } from "lucide-react";
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
  const services = useMemo(() => servicesDraft, [servicesDraft]);

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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
