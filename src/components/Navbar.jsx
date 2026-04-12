import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logo } from "../assets/localImages";

const links = [
  "Home",
  "How It Works",
  "Marketplace",
  "Pricing",
  "Blog",
];

const linkHrefMap = {
  Home: "/",
  "How It Works": "/onboarding",
  Marketplace: "/marketplace",
  Pricing: "/pricing",
  Blog: "/blog",
};

export default function Navbar({ active = "" }) {
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-dropdown]")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[rgba(253,249,243,0.9)] border-b border-[rgba(207,194,212,0.2)] transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="no-underline flex items-center gap-2">
          <img src={logo} alt="SheEarns Logo" className="w-14 h-14 rounded-full object-cover" />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg sm:text-xl lg:text-2xl text-[#500088]">SheEarns</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((label) => (
            <a
              key={label}
              href={linkHrefMap[label]}
              className={`no-underline font-semibold text-sm transition-colors ${
                active === label ? "text-[#500088]" : "text-[#1c1c18] hover:text-[#500088]"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="flex items-center gap-2 bg-[rgba(80,0,136,0.08)] text-[#500088] font-bold text-sm px-4 py-2.5 rounded-2xl hover:bg-[rgba(80,0,136,0.15)] transition-colors no-underline">
                <LayoutDashboard size={16} />
                My Dashboard
              </a>

              <div className="relative" data-dropdown>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-[#fea619] text-[#684000] w-10 h-10 rounded-full font-bold text-sm hover:opacity-90 transition-opacity justify-center"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0) || "Q"
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-[rgba(207,194,212,0.3)] w-52 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[rgba(207,194,212,0.2)]">
                      <p className="font-bold text-[#1c1c18] text-sm truncate">
                        {user?.name || "Queen"}
                      </p>
                      <p className="text-[#4c4452] text-xs">
                        SheEarns Member
                      </p>
                    </div>
                    {[
                      { icon: LayoutDashboard, label: "My Dashboard", href: "/dashboard" },
                      { icon: LayoutDashboard, label: "My Bookings", href: "/bookings" },
                      { icon: User, label: "My Profile", href: "/profile" },
                      { icon: Settings, label: "Settings", href: "/settings" },
                    ].map((item) => (
                      <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 text-[#1c1c18] text-sm hover:bg-[rgba(80,0,136,0.05)] transition-colors no-underline">
                        <item.icon size={16} className="text-[#500088]" />
                        {item.label}
                      </a>
                    ))}
                    <div className="border-t border-[rgba(207,194,212,0.2)]">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 text-sm hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <a href="/login" className="border border-[rgba(207,194,212,0.5)] text-[#1c1c18] text-sm font-semibold px-5 py-2.5 rounded-2xl hover:bg-[rgba(80,0,136,0.05)] transition-colors no-underline">
                Login
              </a>
              <a href="/signup" className="text-white text-sm font-semibold px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-opacity no-underline" style={{ background: "linear-gradient(163deg,#500088 0%,#6b21a8 100%)" }}>
                Get Started
              </a>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {isLoggedIn && (
            <>
              <a href="/dashboard" className="no-underline text-[#500088] text-xs font-bold px-3 py-2 rounded-xl bg-[rgba(80,0,136,0.08)] inline-flex items-center gap-1">
                <LayoutDashboard size={14} /> Dashboard
              </a>
              <a
                href="/profile"
                aria-label="My Profile"
                className="no-underline bg-[#fea619] text-[#684000] w-9 h-9 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || "Q"
                )}
              </a>
            </>
          )}
          <button className="text-[#500088]" onClick={() => setMobileOpen((prev) => !prev)}>
            {mobileOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#fdf9f3] border-t border-[rgba(207,194,212,0.2)] px-6 py-4 flex flex-col gap-3">
          {links.map((label) => (
            <a key={label} href={linkHrefMap[label]} className="no-underline text-[#1c1c18] font-semibold py-2">{label}</a>
          ))}
          {isLoggedIn ? (
            <div className="pt-2 border-t border-[rgba(207,194,212,0.2)] flex flex-col gap-2">
              <a href="/dashboard" className="no-underline text-center bg-[rgba(80,0,136,0.08)] py-3 rounded-2xl text-[#500088] font-bold">My Dashboard</a>
              <a href="/bookings" className="no-underline text-center bg-[rgba(80,0,136,0.08)] py-3 rounded-2xl text-[#500088] font-bold">My Bookings</a>
              <a href="/profile" className="no-underline text-center bg-[rgba(80,0,136,0.08)] py-3 rounded-2xl text-[#500088] font-bold">My Profile</a>
              <button onClick={logout} className="text-center border border-red-200 py-3 rounded-2xl text-red-500 font-bold">Log Out</button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[rgba(207,194,212,0.2)] flex flex-col gap-2">
              <a href="/login" className="no-underline text-center border border-[#cfc2d4] py-3 rounded-2xl text-[#1c1c18] font-bold">Login</a>
              <a href="/signup" className="no-underline text-center bg-[#500088] py-3 rounded-2xl text-white font-bold">Get Started</a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
