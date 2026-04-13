import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  BarChart3,
  Megaphone,
  ShieldCheck,
  Store,
  Send,
  Trash2,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../api";
import LoadingDots from "../components/LoadingDots";

const sections = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "ai", label: "AI Coach", icon: Bot },
  { id: "income", label: "Income", icon: Wallet },
  { id: "announcements", label: "Announcements", icon: Megaphone },
];

function formatCurrency(value) {
  return `Ksh ${Number(value || 0).toLocaleString()}`;
}

function StatCard({ icon: Icon, label, value, subtext, accent = "#500088" }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[rgba(207,194,212,0.18)] relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[rgba(80,0,136,0.05)]" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#4c4452] text-xs font-semibold uppercase tracking-wide">{label}</p>
          <p className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#1c1c18] text-2xl">{value}</p>
          {subtext && <p className="mt-1 text-sm text-[#4c4452]">{subtext}</p>}
        </div>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${accent}12`, color: accent }}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[#f1ede7] text-[#1c1c18]",
    success: "bg-[rgba(22,163,74,0.12)] text-green-700",
    warning: "bg-[rgba(254,166,25,0.14)] text-[#855300]",
    danger: "bg-[rgba(220,38,38,0.12)] text-red-700",
    purple: "bg-[rgba(80,0,136,0.08)] text-[#500088]",
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone] || tones.neutral}`}>{children}</span>;
}

function ProgressBar({ label, value, max, accent = "#500088" }) {
  const safeMax = Math.max(max || 1, 1);
  const percent = Math.min((Number(value || 0) / safeMax) * 100, 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#1c1c18]">{label}</span>
        <span className="text-[#4c4452]">{Number(value || 0).toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full bg-[#eee7f1] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${accent}, #fea619)` }} />
      </div>
    </div>
  );
}

function ChartBars({ data, valueKey, labelKey = "date" }) {
  const maxValue = Math.max(...data.map((item) => Number(item?.[valueKey] || 0)), 1);

  return (
    <div className="grid grid-cols-7 gap-2 items-end min-h-44">
      {data.map((item) => {
        const value = Number(item?.[valueKey] || 0);
        const height = `${Math.max((value / maxValue) * 100, 6)}%`;
        return (
          <div key={item?.[labelKey] || value} className="flex flex-col items-center gap-2 h-full">
            <div className="flex-1 w-full flex items-end">
              <div className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#500088,rgba(254,166,25,0.82))]" style={{ height }} title={`${item?.[labelKey] || ""}: ${value}`} />
            </div>
            <span className="text-[10px] text-[#4c4452] font-medium text-center leading-tight">{String(item?.[labelKey] || "").slice(5)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [notice, setNotice] = useState("");
  const [announcement, setAnnouncement] = useState({ title: "", body: "" });
  const [actionId, setActionId] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await apiRequest("/admin/dashboard");
      setDashboard(payload || null);
    } catch (err) {
      setError(err?.message || "Could not load admin dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = dashboard?.summary || {};
  const users = dashboard?.users || [];
  const services = dashboard?.services || [];
  const aiMonitoring = dashboard?.ai_monitoring || {};
  const growthChart = dashboard?.growth_chart || [];
  const topEarnings = dashboard?.top_earning_users || [];
  const popularCategories = dashboard?.popular_categories || [];
  const popularSkills = dashboard?.popular_skills || [];
  const popularLocations = dashboard?.popular_locations || [];
  const announcements = dashboard?.announcements || [];

  const handleUserAction = async (userId, action) => {
    if (action === "delete") {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;
    }

    setActionId(userId);
    setNotice("");
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      await loadDashboard();
      setNotice(`User updated: ${action}.`);
    } catch (err) {
      setNotice(err?.message || "Could not update user right now.");
    } finally {
      setActionId("");
    }
  };

  const handleServiceAction = async (serviceId, action) => {
    if (action === "delete") {
      const confirmed = window.confirm("Are you sure you want to delete this service listing?");
      if (!confirmed) return;
    }

    setActionId(serviceId);
    setNotice("");
    try {
      if (action === "delete") {
        await apiRequest(`/admin/services/${serviceId}`, { method: "DELETE" });
      } else {
        await apiRequest(`/admin/services/${serviceId}/approval`, {
          method: "PATCH",
          body: JSON.stringify({ approval_status: action }),
        });
      }
      await loadDashboard();
      setNotice(`Service updated: ${action}.`);
    } catch (err) {
      setNotice(err?.message || "Could not update service right now.");
    } finally {
      setActionId("");
    }
  };

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault();
    if (!announcement.title.trim() || !announcement.body.trim()) {
      setNotice("Please add both an announcement title and body.");
      return;
    }

    setActionId("announcement");
    setNotice("");
    try {
      await apiRequest("/admin/announcements", {
        method: "POST",
        body: JSON.stringify({
          title: announcement.title.trim(),
          body: announcement.body.trim(),
          channel: "dashboard",
        }),
      });
      setAnnouncement({ title: "", body: "" });
      await loadDashboard();
      setNotice("Announcement sent to users.");
    } catch (err) {
      setNotice(err?.message || "Could not send announcement right now.");
    } finally {
      setActionId("");
    }
  };

  const userStatusTone = (status) => {
    if (status === "active") return "success";
    if (status === "inactive") return "warning";
    if (status === "suspended") return "danger";
    return "neutral";
  };

  const approvalTone = (status) => {
    const normalized = String(status || "pending").toLowerCase();
    if (normalized === "approved") return "success";
    if (normalized === "rejected") return "danger";
    return "warning";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(80,0,136,0.10),transparent_32%),linear-gradient(180deg,#fdf9f3_0%,#fbf6ff_100%)] font-['Inter',sans-serif]">
      <Navbar active="Dashboard" isLoggedIn />

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <section className="bg-white/90 backdrop-blur rounded-4xl p-8 shadow-sm border border-[rgba(207,194,212,0.2)] overflow-hidden relative">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[rgba(80,0,136,0.08)]" />
            <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-[rgba(254,166,25,0.08)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge tone="purple">Admin console</Badge>
                <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#1c1c18] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  SheEarns operations dashboard
                </h1>
                <p className="mt-3 text-[#4c4452] text-sm sm:text-base max-w-2xl">
                  Review users, moderate marketplace listings, monitor AI usage, track platform growth, and publish updates from one place.
                </p>
                {notice && <p className="mt-4 text-sm font-semibold text-[#500088]">{notice}</p>}
                {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-70">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all ${active ? "bg-[#500088] text-white border-[#500088] shadow-md" : "bg-white text-[#1c1c18] border-[rgba(207,194,212,0.35)] hover:border-[#500088]"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} strokeWidth={1.8} />
                        <span className="text-sm font-bold">{section.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total users" value={Number(summary.total_users || 0).toLocaleString()} subtext={`Active ${Number(summary.active_users || 0).toLocaleString()} / inactive ${Number(summary.inactive_users || 0).toLocaleString()}`} />
            <StatCard icon={Store} label="Total services" value={Number(summary.total_services || 0).toLocaleString()} subtext={`Popular: ${popularCategories[0]?.label || "n/a"}`} accent="#855300" />
            <StatCard icon={Wallet} label="Total income" value={formatCurrency(summary.total_income)} subtext={`Last 7 days: ${formatCurrency(summary.income_last_7_days)}`} accent="#0f766e" />
            <StatCard icon={Bot} label="AI conversations" value={Number(summary.ai_conversations || 0).toLocaleString()} subtext={`${Number(summary.misuse_flags || 0).toLocaleString()} misuse flags`} accent="#940058" />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Platform growth</h2>
                  <p className="text-sm text-[#4c4452] mt-1">Signups and income over the last 14 days.</p>
                </div>
                <Badge tone="purple">14-day view</Badge>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-[#f7f3ed] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#1c1c18] text-sm">Daily signups</h3>
                    <Badge tone="purple">Users</Badge>
                  </div>
                  <ChartBars data={growthChart} valueKey="signups" />
                </div>
                <div className="rounded-2xl bg-[#f7f3ed] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#1c1c18] text-sm">Daily income</h3>
                    <Badge tone="success">Ksh</Badge>
                  </div>
                  <ChartBars data={growthChart} valueKey="income" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4c4452]">
                <ProgressBar label="This week signups" value={summary.new_signups_this_week || 0} max={Math.max(summary.new_signups_this_week || 0, summary.new_signups_last_week || 1)} />
                <ProgressBar label="Last week signups" value={summary.new_signups_last_week || 0} max={Math.max(summary.new_signups_this_week || 1, summary.new_signups_last_week || 1)} accent="#855300" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#1c1c18]">Highlights</h2>
                <Badge tone="warning">Live</Badge>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#f7f3ed] p-4">
                  <p className="text-xs font-bold text-[#4c4452] uppercase tracking-wide">New signups</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#500088]">{Number(summary.new_signups_this_week || 0).toLocaleString()}</p>
                  <p className="text-sm text-[#4c4452]">This week vs {Number(summary.new_signups_last_week || 0).toLocaleString()} last week</p>
                </div>
                <div className="rounded-2xl bg-[#f7f3ed] p-4">
                  <p className="text-xs font-bold text-[#4c4452] uppercase tracking-wide">User balance</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#1c1c18]">{Number(summary.active_users || 0).toLocaleString()} active</p>
                  <p className="text-sm text-[#4c4452]">{Number(summary.blocked_users || 0).toLocaleString()} blocked accounts</p>
                </div>
                <div className="rounded-2xl bg-[#f7f3ed] p-4">
                  <p className="text-xs font-bold text-[#4c4452] uppercase tracking-wide">Top skill</p>
                  <p className="mt-1 text-lg font-bold text-[#500088]">{popularSkills[0]?.label || "No skill data yet"}</p>
                  <p className="text-sm text-[#4c4452]">{popularLocations[0]?.label || "No location data yet"}</p>
                </div>
              </div>
            </div>
          </section>

          {activeSection === "users" && (
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">User management</h2>
                  <p className="text-sm text-[#4c4452] mt-1">See profiles, skills, locations, and account health.</p>
                </div>
                <Badge tone="purple">{users.length} users</Badge>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {users.slice(0, 12).map((user) => (
                  <article key={user.id} className="rounded-3xl border border-[rgba(207,194,212,0.2)] bg-[#fbf8ff] p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#1c1c18] text-base">{user.name}</h3>
                          <Badge tone={userStatusTone(user.status)}>{user.status}</Badge>
                        </div>
                        <p className="text-sm text-[#4c4452] mt-1">{user.masked_email}</p>
                        <p className="text-sm text-[#4c4452]">{user.location || "No location added"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-[#4c4452] uppercase tracking-wide font-bold">Services</p>
                        <p className="text-2xl font-extrabold text-[#500088]">{Number(user.service_count || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(user.skills || []).slice(0, 4).map((skill) => (
                        <Badge key={skill} tone="neutral">{skill}</Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[#4c4452] text-xs uppercase tracking-wide font-bold">Joined</p>
                        <p className="font-semibold text-[#1c1c18] mt-1">{user.joined_at ? new Date(user.joined_at).toLocaleDateString() : "Unknown"}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-3">
                        <p className="text-[#4c4452] text-xs uppercase tracking-wide font-bold">Last activity</p>
                        <p className="font-semibold text-[#1c1c18] mt-1">{user.last_activity_at ? new Date(user.last_activity_at).toLocaleDateString() : "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleUserAction(user.id, user.is_suspended ? "unsuspend" : "suspend")} disabled={actionId === user.id} className="inline-flex items-center gap-2 rounded-xl bg-[#500088] px-4 py-2.5 text-white text-sm font-bold disabled:opacity-60">
                        {actionId === user.id ? <LoadingDots size={16} color="#ffffff" /> : <ShieldCheck size={16} strokeWidth={1.8} />} {user.is_suspended ? "Unsuspend" : "Suspend"}
                      </button>
                      <button onClick={() => handleUserAction(user.id, "delete")} disabled={actionId === user.id} className="inline-flex items-center gap-2 rounded-xl bg-[#1c1c18] px-4 py-2.5 text-white text-sm font-bold disabled:opacity-60">
                        {actionId === user.id ? <LoadingDots size={16} color="#ffffff" /> : <Trash2 size={16} strokeWidth={1.8} />} Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSection === "marketplace" && (
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Marketplace management</h2>
                  <p className="text-sm text-[#4c4452] mt-1">Approve, reject, or remove listings before they reach the marketplace.</p>
                </div>
                <Badge tone="purple">{services.length} listings</Badge>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {services.slice(0, 12).map((service) => (
                  <article key={service.id} className="rounded-3xl border border-[rgba(207,194,212,0.2)] bg-[#fcfaf6] p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#1c1c18] text-base">{service.title}</h3>
                          <Badge tone={approvalTone(service.approval_status)}>{service.approval_status}</Badge>
                        </div>
                        <p className="text-sm text-[#4c4452] mt-1">{service.category} · {service.location}</p>
                        <p className="text-sm text-[#4c4452]">Provider: {service.provider_masked}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-[#4c4452] uppercase tracking-wide font-bold">Bookings</p>
                        <p className="text-2xl font-extrabold text-[#500088]">{Number(service.bookings || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="text-sm text-[#4c4452] leading-normal">{formatCurrency(service.price_min)} to {formatCurrency(service.price_max)}</p>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleServiceAction(service.id, "approve")} disabled={actionId === service.id} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-white text-sm font-bold disabled:opacity-60">
                        {actionId === service.id ? <LoadingDots size={16} color="#ffffff" /> : <CheckCircle2 size={16} strokeWidth={1.8} />} Approve
                      </button>
                      <button onClick={() => handleServiceAction(service.id, "rejected")} disabled={actionId === service.id} className="inline-flex items-center gap-2 rounded-xl bg-[#e96a4b] px-4 py-2.5 text-white text-sm font-bold disabled:opacity-60">
                        {actionId === service.id ? <LoadingDots size={16} color="#ffffff" /> : <XCircle size={16} strokeWidth={1.8} />} Reject
                      </button>
                      <button onClick={() => handleServiceAction(service.id, "delete")} disabled={actionId === service.id} className="inline-flex items-center gap-2 rounded-xl bg-[#1c1c18] px-4 py-2.5 text-white text-sm font-bold disabled:opacity-60">
                        {actionId === service.id ? <LoadingDots size={16} color="#ffffff" /> : <Trash2 size={16} strokeWidth={1.8} />} Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-[#f7f3ed] p-5">
                  <h3 className="font-bold text-[#1c1c18]">Popular categories</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {popularCategories.map((item) => (
                      <ProgressBar key={item.label} label={item.label} value={item.count} max={Math.max(...popularCategories.map((entry) => entry.count), 1)} />
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-[#f7f3ed] p-5">
                  <h3 className="font-bold text-[#1c1c18]">Popular locations</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {popularLocations.map((item) => (
                      <ProgressBar key={item.label} label={item.label} value={item.count} max={Math.max(...popularLocations.map((entry) => entry.count), 1)} accent="#855300" />
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-[#f7f3ed] p-5">
                  <h3 className="font-bold text-[#1c1c18]">Popular skills</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {popularSkills.map((item) => (
                      <ProgressBar key={item.label} label={item.label} value={item.count} max={Math.max(...popularSkills.map((entry) => entry.count), 1)} accent="#940058" />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "ai" && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">AI coaching monitor</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Most common questions and the latest conversation flags.</p>
                  </div>
                  <Badge tone="warning">{Number(aiMonitoring.total_conversations || 0).toLocaleString()} chats</Badge>
                </div>

                <div className="flex flex-col gap-3">
                  {(aiMonitoring.popular_questions || []).map((question) => (
                    <div key={question.question} className="rounded-2xl bg-[#f7f3ed] p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1c1c18]">{question.question}</p>
                        <p className="text-xs text-[#4c4452] mt-1">Repeated {question.count} times</p>
                      </div>
                      <Badge tone="purple">Top</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Misuse review</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Flagged prompts need manual review.</p>
                  </div>
                  <Badge tone={Number(summary.misuse_flags || 0) > 0 ? "danger" : "success"}>{Number(summary.misuse_flags || 0).toLocaleString()} flags</Badge>
                </div>

                <div className="flex flex-col gap-3">
                  {(aiMonitoring.misuse_events || []).slice(0, 6).map((event) => (
                    <div key={event.id} className="rounded-2xl border border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.04)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#1c1c18] text-sm">{event.question}</p>
                        <Badge tone="danger">{event.risk_level || "high"}</Badge>
                      </div>
                      <p className="text-xs text-[#4c4452] mt-2">{event.reason}</p>
                    </div>
                  ))}
                  {(aiMonitoring.misuse_events || []).length === 0 && (
                    <div className="rounded-2xl bg-[#f7f3ed] p-4 text-sm text-[#4c4452]">No flagged AI conversations yet.</div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === "income" && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Top earning users</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Anonymized earnings leaderboard from completed bookings.</p>
                  </div>
                  <Badge tone="success">{formatCurrency(summary.total_income)}</Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {topEarnings.map((item, index) => (
                    <div key={item.user_id} className="rounded-2xl bg-[#f7f3ed] p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#1c1c18]">#{index + 1} {item.masked_name}</p>
                        <p className="text-xs text-[#4c4452]">{item.masked_email}</p>
                      </div>
                      <p className="font-extrabold text-[#500088]">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                  {topEarnings.length === 0 && <div className="rounded-2xl bg-[#f7f3ed] p-4 text-sm text-[#4c4452]">No completed earnings yet.</div>}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Growth by day</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Income over the last 14 days.</p>
                  </div>
                  <Badge tone="purple">Trend</Badge>
                </div>
                <ChartBars data={growthChart} valueKey="income" />
              </div>
            </section>
          )}

          {activeSection === "announcements" && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center gap-3 mb-5">
                  <Megaphone className="text-[#500088]" size={20} strokeWidth={1.8} />
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Send announcement</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Broadcast a message to users and keep the feed updated.</p>
                  </div>
                </div>

                <form onSubmit={handleAnnouncementSubmit} className="flex flex-col gap-4">
                  <input
                    value={announcement.title}
                    onChange={(event) => setAnnouncement((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Announcement title"
                    className="w-full rounded-2xl bg-[#f7f3ed] px-4 py-3 text-[#1c1c18] outline-none focus:ring-2 focus:ring-[#500088]"
                  />
                  <textarea
                    value={announcement.body}
                    onChange={(event) => setAnnouncement((current) => ({ ...current, body: event.target.value }))}
                    placeholder="Write the update for all users"
                    rows={5}
                    className="w-full rounded-2xl bg-[#f7f3ed] px-4 py-3 text-[#1c1c18] outline-none focus:ring-2 focus:ring-[#500088] resize-none"
                  />
                  <button
                    type="submit"
                    disabled={actionId === "announcement"}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#500088] px-5 py-3 text-white font-bold disabled:opacity-60"
                  >
                    {actionId === "announcement" ? <LoadingDots size={16} color="#ffffff" /> : <Send size={16} strokeWidth={1.8} />} {actionId === "announcement" ? "Sending..." : "Send to users"}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[rgba(207,194,212,0.18)]">
                <div className="flex items-center gap-3 mb-5">
                  <Activity className="text-[#855300]" size={20} strokeWidth={1.8} />
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#1c1c18]">Recent announcements</h2>
                    <p className="text-sm text-[#4c4452] mt-1">Track what has already been sent.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {announcements.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-[#f7f3ed] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[#1c1c18] text-sm">{item.title}</p>
                        <Badge tone="purple">{item.channel}</Badge>
                      </div>
                      <p className="text-sm text-[#4c4452] mt-2 leading-normal">{item.body}</p>
                    </div>
                  ))}
                  {announcements.length === 0 && <div className="rounded-2xl bg-[#f7f3ed] p-4 text-sm text-[#4c4452]">No announcements yet.</div>}
                </div>
              </div>
            </section>
          )}

          {loading && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-[rgba(207,194,212,0.18)] text-[#4c4452] text-sm flex items-center gap-3">
              <LoadingDots size={22} />
              Loading admin dashboard...
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
