import { useEffect, useState } from "react";
import {
  Bell,
  Lock,
  EyeOff,
  Save,
  Shield,
  UserRound,
  Smartphone,
  Globe,
  Eye,
  LogOut,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";

function getPasswordChecks(value) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
}

function getPasswordStrength(value) {
  const checks = getPasswordChecks(value);
  const score = Object.values(checks).filter(Boolean).length;

  if (!value) return { label: "", percent: 0, score, checks, color: "#e6e2dc" };
  if (score <= 2) return { label: "Weak", percent: 35, score, checks, color: "#dc2626" };
  if (score <= 3) return { label: "Fair", percent: 60, score, checks, color: "#d97706" };
  if (score <= 4) return { label: "Good", percent: 80, score, checks, color: "#2563eb" };
  return { label: "Strong", percent: 100, score, checks, color: "#16a34a" };
}

export default function Settings() {
  const { user, updateUser, isLoggedIn, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);
  const [marketing, setMarketing] = useState(user?.marketingEmailsEnabled ?? false);
  const [weeklySummary, setWeeklySummary] = useState(user?.weeklySummaryEnabled ?? true);
  const [pushReminders, setPushReminders] = useState(user?.pushRemindersEnabled ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? false);
  const [profileVisibility, setProfileVisibility] = useState(user?.profileVisibility || "public");
  const [language, setLanguage] = useState(user?.language || "English");
  const [currency, setCurrency] = useState(user?.currency || "KES");
  const [timezone, setTimezone] = useState(user?.timezone || "Africa/Nairobi");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const passwordStrength = getPasswordStrength(newPassword);
  const isPasswordStrongEnough = passwordStrength.score >= 4;
  const passwordsMatch = !!newPassword && !!confirmPassword && newPassword === confirmPassword;
  const canChangePassword = !!currentPassword && isPasswordStrongEnough && passwordsMatch;

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    async function loadSettings() {
      try {
        const payload = await apiRequest("/users/me");
        if (cancelled) return;

        setFullName(payload?.full_name || user?.name || "");
        setEmail(payload?.email || "");
        setPhone(payload?.phone || "");
        setLocation(payload?.location || "");
        setNotifications(payload?.notifications_enabled ?? true);
        setMarketing(payload?.marketing_emails_enabled ?? false);

        updateUser({
          id: payload?.id || user?.id || null,
          name: payload?.full_name || user?.name || "Queen",
          email: payload?.email || user?.email || "",
          phone: payload?.phone || user?.phone || "",
          location: payload?.location || user?.location || "",
          avatar: payload?.avatar_url || user?.avatar || null,
          services: payload?.services || user?.services || [],
          notificationsEnabled: payload?.notifications_enabled ?? true,
          marketingEmailsEnabled: payload?.marketing_emails_enabled ?? false,
          weeklySummaryEnabled: user?.weeklySummaryEnabled ?? true,
          pushRemindersEnabled: user?.pushRemindersEnabled ?? true,
          twoFactorEnabled: user?.twoFactorEnabled ?? false,
          profileVisibility: user?.profileVisibility || "public",
          language: user?.language || "English",
          currency: user?.currency || "KES",
          timezone: user?.timezone || "Africa/Nairobi",
        });
      } catch {
        // Keep current values if backend request fails.
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setNotice("");

    try {
      const payload = await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          location: location.trim() || null,
          notifications_enabled: notifications,
          marketing_emails_enabled: marketing,
        }),
      });

      updateUser({
        id: payload?.id || user?.id || null,
        name: payload?.full_name || fullName.trim() || user?.name || "Queen",
        email: payload?.email || email.trim(),
        phone: payload?.phone || phone.trim(),
        location: payload?.location || location.trim(),
        avatar: payload?.avatar_url || user?.avatar || null,
        services: payload?.services || user?.services || [],
        notificationsEnabled: payload?.notifications_enabled ?? notifications,
        marketingEmailsEnabled: payload?.marketing_emails_enabled ?? marketing,
        weeklySummaryEnabled: weeklySummary,
        pushRemindersEnabled: pushReminders,
        twoFactorEnabled,
        profileVisibility,
        language,
        currency,
        timezone,
      });

      setSaved(true);
      setNotice("Settings updated.");
    } catch (err) {
      setNotice(err?.message || "Could not save settings right now.");
    } finally {
      setSavingSettings(false);
      window.setTimeout(() => {
        setSaved(false);
        setNotice("");
      }, 2500);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setNotice("Fill current, new, and confirm password fields.");
      return;
    }
    if (!isPasswordStrongEnough) {
      setNotice("Use a stronger password: 8+ chars, uppercase, lowercase, number, and symbol.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice("New password and confirm password do not match.");
      return;
    }

    setChangingPassword(true);
    setNotice("");
    try {
      await apiRequest("/users/me/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Password updated successfully.");
    } catch (err) {
      setNotice(err?.message || "Could not update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fdf9f3] font-['Inter',sans-serif]">
        <Navbar active="How It Works" />
        <main className="pt-28 px-6 pb-20">
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center">
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#500088]">Settings</h1>
            <p className="text-[#4c4452] mt-3">Please log in to manage your settings.</p>
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
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm flex flex-col gap-7">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#1c1c18]">Settings</h1>
            <p className="text-[#4c4452] mt-2">Manage account details, security, privacy, and preferences.</p>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#1c1c18] inline-flex items-center gap-2"><UserRound size={16} className="text-[#500088]" /> Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                placeholder="Full name"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                placeholder="Email"
              />
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                placeholder="Phone number"
              />
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="bg-[#f7f3ed] rounded-xl px-4 py-3 outline-none"
                placeholder="Location"
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#1c1c18] inline-flex items-center gap-2"><Bell size={16} className="text-[#500088]" /> Notifications</h2>
            <label className="flex items-center justify-between bg-[#f7f3ed] rounded-xl px-4 py-3">
              <span className="text-sm text-[#1c1c18]">Enable booking alerts</span>
              <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-[#f7f3ed] rounded-xl px-4 py-3">
              <span className="text-sm text-[#1c1c18]">Receive growth tips by email</span>
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-[#f7f3ed] rounded-xl px-4 py-3">
              <span className="text-sm text-[#1c1c18]">Weekly progress summary</span>
              <input type="checkbox" checked={weeklySummary} onChange={(event) => setWeeklySummary(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between bg-[#f7f3ed] rounded-xl px-4 py-3">
              <span className="text-sm text-[#1c1c18]">Push reminders</span>
              <input type="checkbox" checked={pushReminders} onChange={(event) => setPushReminders(event.target.checked)} />
            </label>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#1c1c18] inline-flex items-center gap-2"><Lock size={16} className="text-[#500088]" /> Password & Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 pr-10 outline-none"
                  placeholder="Current password"
                />
                <button type="button" onClick={() => setShowCurrentPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c4452]">
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 pr-10 outline-none"
                  placeholder="New password"
                />
                <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c4452]">
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full bg-[#f7f3ed] rounded-xl px-4 py-3 pr-10 outline-none"
                  placeholder="Confirm password"
                />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c4452]">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {newPassword && (
              <div className="bg-[#f7f3ed] rounded-xl px-4 py-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#4c4452]">Password strength</span>
                  <span className="font-bold text-[#500088]">{passwordStrength.label}</span>
                </div>
                <div className="h-2 rounded-full bg-[#e6e2dc] overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${passwordStrength.percent}%`,
                      background: passwordStrength.color,
                    }}
                  />
                </div>
                <p className="text-xs text-[#4c4452] mt-2">Use at least 8 characters with uppercase, lowercase, number, and symbol.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                  <span className={passwordStrength.checks.length ? "text-[#166534]" : "text-[#4c4452]"}>At least 8 characters</span>
                  <span className={passwordStrength.checks.upper ? "text-[#166534]" : "text-[#4c4452]"}>One uppercase letter</span>
                  <span className={passwordStrength.checks.lower ? "text-[#166534]" : "text-[#4c4452]"}>One lowercase letter</span>
                  <span className={passwordStrength.checks.number ? "text-[#166534]" : "text-[#4c4452]"}>One number</span>
                  <span className={passwordStrength.checks.symbol ? "text-[#166534]" : "text-[#4c4452]"}>One symbol</span>
                </div>
              </div>
            )}
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-[#b42318]">New password and confirm password do not match yet.</p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-xs text-[#166534]">Passwords match.</p>
            )}
            <label className="flex items-center justify-between bg-[#f7f3ed] rounded-xl px-4 py-3">
              <span className="text-sm text-[#1c1c18] inline-flex items-center gap-2"><Shield size={15} className="text-[#500088]" /> Enable 2-factor authentication</span>
              <input type="checkbox" checked={twoFactorEnabled} onChange={(event) => setTwoFactorEnabled(event.target.checked)} />
            </label>
            <div className="flex items-center gap-3">
              <button onClick={handleChangePassword} disabled={changingPassword || !canChangePassword} className="bg-[#1c1c18] text-white rounded-xl px-5 py-2.5 font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                {changingPassword ? "Updating password..." : "Change Password"}
              </button>
              <p className="text-xs text-[#4c4452]">Use this button to update password only.</p>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#1c1c18] inline-flex items-center gap-2"><Eye size={16} className="text-[#500088]" /> Privacy</h2>
            <div className="bg-[#f7f3ed] rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[#1c1c18]">Profile visibility</span>
              <select
                value={profileVisibility}
                onChange={(event) => setProfileVisibility(event.target.value)}
                className="bg-white rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="public">Public</option>
                <option value="clients-only">Clients Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#1c1c18] inline-flex items-center gap-2"><Globe size={16} className="text-[#500088]" /> Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#f7f3ed] rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[#1c1c18]">Language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-white rounded-lg px-2 py-1.5 text-sm outline-none">
                  <option>English</option>
                  <option>Swahili</option>
                </select>
              </div>
              <div className="bg-[#f7f3ed] rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[#1c1c18]">Currency</span>
                <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="bg-white rounded-lg px-2 py-1.5 text-sm outline-none">
                  <option>KES</option>
                  <option>USD</option>
                </select>
              </div>
              <div className="bg-[#f7f3ed] rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[#1c1c18] inline-flex items-center gap-1"><Smartphone size={14} /> Timezone</span>
                <select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="bg-white rounded-lg px-2 py-1.5 text-sm outline-none">
                  <option>Africa/Nairobi</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button onClick={handleSaveSettings} disabled={savingSettings} className="bg-[#500088] text-white rounded-xl px-5 py-3 inline-flex items-center gap-2 font-bold disabled:opacity-70">
              <Save size={16} /> {savingSettings ? "Saving settings..." : "Save Settings"}
            </button>
            {(saved || notice) && <span className="text-sm font-semibold text-[#500088]">{notice || "Settings updated."}</span>}
          </div>

          <section className="border border-red-200 bg-red-50 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-red-700 font-bold text-sm">Danger Zone</h3>
              <p className="text-red-700/80 text-xs">Need to switch account on this device?</p>
            </div>
            <button
              onClick={() => {
                logout();
                window.history.pushState({}, "", "/login");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-red-600 border border-red-200 font-semibold"
            >
              <LogOut size={15} /> Log Out
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
