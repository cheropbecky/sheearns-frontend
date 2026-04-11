import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Rocket,
  BadgeCheck,
  UserRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import { imageOne, imageThree, logo } from "../assets/localImages";

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

  if (!value) {
    return { score: 0, label: "", color: "bg-[#e6e2dc]", checks };
  }
  if (score <= 2) {
    return { score, label: "Weak", color: "bg-[#dc2626]", checks };
  }
  if (score === 3) {
    return { score, label: "Fair", color: "bg-[#d97706]", checks };
  }
  if (score === 4) {
    return { score, label: "Good", color: "bg-[#2563eb]", checks };
  }
  return { score, label: "Strong", color: "bg-[#16a34a]", checks };
}

export function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      login({
        id: payload?.user?.id || null,
        name: payload?.user?.full_name || "Queen",
        email: payload?.user?.email || email.trim(),
        token: payload?.access_token || null,
        monthlyGoal: payload?.user?.monthly_goal || 5000,
        avatar: payload?.user?.avatar_url || null,
        services: payload?.user?.services || [],
        notificationsEnabled: payload?.user?.notifications_enabled ?? true,
        marketingEmailsEnabled: payload?.user?.marketing_emails_enabled ?? false,
      });
      onNavigate("");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 font-['Inter',sans-serif] flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src={imageThree}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[rgba(80,0,136,0.45)] to-[rgba(80,0,136,0.70)]" />
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-5" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white opacity-5" />
          <span className="absolute top-10 left-10 font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-xl sm:text-2xl lg:text-3xl inline-flex items-center gap-2">
            <img src={logo} alt="SheEarns" className="w-10 h-10 rounded-full object-cover" />
            SheEarns
          </span>

          <div className="absolute bottom-16 left-10 right-10 bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <span className="bg-[rgba(254,166,25,0.2)] text-[#fea619] text-xs font-bold uppercase tracking-wide sm:tracking-widest px-3 py-1 rounded-full">
              Member Story
            </span>
            <p className="text-white text-xl font-medium italic mt-4 leading-normal sm:leading-relaxed">
              "Success is not only what you accomplish. It is also what you inspire others to do."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-[#fea619] flex items-center justify-center">
                <UserRound size={18} strokeWidth={1.8} className="text-[#684000]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Amina K.</p>
                <p className="text-[#d7a8ff] text-xs">Hair Specialist - Nairobi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
          <div className="w-full max-w-md flex flex-col gap-8">
            <div className="lg:hidden font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-lg sm:text-xl lg:text-2xl inline-flex items-center gap-2">
              <img src={logo} alt="SheEarns" className="w-8 h-8 rounded-full object-cover" />
              SheEarns
            </div>

            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-2xl sm:text-3xl lg:text-4xl leading-tight">
                Welcome Back
              </h2>
              <p className="text-[#4c4452] text-sm md:text-base mt-2">Your business dashboard is waiting.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[#4c4452] text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c4452]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base pl-10 pr-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#4c4452] text-sm font-medium">Password</label>
                  <a href="#" className="text-[#500088] text-sm font-bold hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock size={16} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c4452]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base pl-10 pr-12 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c4452] hover:text-[#500088]">
                    {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full text-white font-bold text-sm md:text-base py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity mt-2 bg-[#500088]">
                {submitting ? "Signing In..." : "Sign In"}
              </button>

              {error && (
                <p className="text-sm text-[#b42318] bg-[#fff0ef] border border-[#ffd1cc] rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#e6e2dc]" />
                <span className="text-[#4c4452] text-sm">or continue with</span>
                <div className="flex-1 h-px bg-[#e6e2dc]" />
              </div>

              <button className="w-full flex items-center justify-center gap-3 border-2 border-[#e6e2dc] text-[#1c1c18] font-bold text-base py-4 rounded-2xl hover:border-[#500088] transition-colors">
                <span className="text-xl">G</span>
                Continue with Google
              </button>
            </form>

            <p className="text-center text-[#4c4452] text-sm">
              Do not have an account?{" "}
              <button onClick={() => onNavigate("signup")} className="text-[#500088] font-bold hover:underline">
                Join now
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export function Signup({ onNavigate }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);
  const isPasswordStrongEnough = strength.score >= 4;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = !!name.trim() && !!email.trim() && isPasswordStrongEnough && passwordsMatch;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in name, email, and password.");
      return;
    }

    if (!isPasswordStrongEnough) {
      setError("Please choose a stronger password before continuing.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your password.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: name.trim(),
          email: email.trim(),
          password,
          location: "Nairobi",
        }),
      });

      login({
        id: payload?.user?.id || null,
        name: payload?.user?.full_name || name.trim(),
        email: payload?.user?.email || email.trim(),
        token: payload?.access_token || null,
        monthlyGoal: payload?.user?.monthly_goal || 5000,
        avatar: payload?.user?.avatar_url || null,
        services: payload?.user?.services || [],
        notificationsEnabled: payload?.user?.notifications_enabled ?? true,
        marketingEmailsEnabled: payload?.user?.marketing_emails_enabled ?? false,
      });
      onNavigate("");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 font-['Inter',sans-serif] flex">
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
          <img
            src={imageOne}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-br from-[rgba(148,0,88,0.50)] to-[rgba(80,0,136,0.65)]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white opacity-5 -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white opacity-5 translate-y-1/4 -translate-x-1/4" />

          <div className="absolute inset-0 flex flex-col justify-center px-16 gap-8">
            <div className="bg-[rgba(254,166,25,0.2)] self-start flex items-center gap-2 px-4 py-2 rounded-full">
              <BadgeCheck size={15} strokeWidth={2} className="text-[#fea619]" />
              <span className="text-[#fea619] text-xs font-bold uppercase tracking-wide sm:tracking-widest">Join the Movement</span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-white text-4xl sm:text-5xl lg:text-5xl leading-tight">
              Build Your Crown
            </h2>

            <p className="text-[#d7a8ff] text-xl leading-normal sm:leading-relaxed max-w-md">
              Join thousands of women turning skills into shillings. Your next chapter starts now.
            </p>

            <div className="flex items-center gap-3">
              {[UserRound, UserRound, UserRound, UserRound].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.15)] border-2 border-white/30 flex items-center justify-center text-xl">
                  <Icon size={18} strokeWidth={2} className="text-white" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-[#fea619] border-2 border-white/30 flex items-center justify-center text-sm font-bold text-[#684000]">+9k</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
          <div className="w-full max-w-sm flex flex-col gap-7">
            <div className="lg:hidden font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-lg sm:text-xl lg:text-2xl inline-flex items-center gap-2">
              <img src={logo} alt="SheEarns" className="w-8 h-8 rounded-full object-cover" />
              SheEarns
            </div>

            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[#500088] text-xl sm:text-2xl lg:text-3xl leading-tight inline-flex items-center gap-2">
                Start Your Journey <Rocket size={26} strokeWidth={1.8} />
              </h2>
              <p className="text-[#4c4452] text-base mt-1">Create your free SheEarns account</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#4c4452] text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amina J. Okafor"
                  className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base px-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#4c4452] text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@sheearns.com"
                  className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base px-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#4c4452] text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base px-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                />
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#4c4452]">Password strength</span>
                    <span className="text-xs font-semibold text-[#4c4452]">{strength.label || "-"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e6e2dc] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#4c4452] mt-2">
                    Use at least 8 characters with uppercase, lowercase, number, and symbol.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#4c4452] text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f7f3ed] text-[#1c1c18] text-base px-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#500088] transition-all"
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-[#b42318]">Passwords do not match yet.</p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-xs text-[#166534]">Passwords match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="w-full text-white font-bold text-base py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity bg-[#500088] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating Account..." : "Create My Account"}
              </button>

              {error && (
                <p className="text-sm text-[#b42318] bg-[#fff0ef] border border-[#ffd1cc] rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#e6e2dc]" />
                <span className="text-[#4c4452] text-xs">or</span>
                <div className="flex-1 h-px bg-[#e6e2dc]" />
              </div>

              <button className="w-full flex items-center justify-center gap-3 border-2 border-[#e6e2dc] text-[#1c1c18] font-bold text-sm py-3 rounded-2xl hover:border-[#500088] transition-colors">
                <span className="text-base">G</span>
                Sign up with Google
              </button>
            </form>

            <p className="text-center text-[#4c4452] text-sm">
              Already have an account?{" "}
              <button onClick={() => onNavigate("login")} className="text-[#500088] font-bold hover:underline">Login</button>
            </p>

            <p className="text-center text-[rgba(76,68,82,0.5)] text-xs inline-flex items-center justify-center gap-1">
              <ShieldCheck size={14} strokeWidth={1.8} /> Safe and secure. By signing up, you agree to our Terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
