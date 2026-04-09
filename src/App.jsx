import { useEffect, useState } from "react";
import { AlertTriangle, Home } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import PricingCalculator from "./pages/Pricingcalculator";
import Marketplace from "./pages/Marketplace";
import AICoach from "./pages/Aicoach";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import Roadmap from "./pages/Roadmap";
import QueenProfile from "./pages/QueenProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { Login, Signup } from "./pages/Auth";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdf9f3] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm text-center">
        <AlertTriangle className="mx-auto text-[#500088]" size={42} strokeWidth={1.5} />
        <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#1c1c18]">Page not found</h1>
        <p className="mt-2 text-[#4c4452]">The route you requested does not exist.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#500088] px-5 py-3 text-white font-bold no-underline hover:opacity-90 transition-opacity"
        >
          <Home size={16} strokeWidth={1.5} /> Back Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname || "/");

    const onClick = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (anchor.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      if (window.location.pathname !== href) {
        window.history.pushState({}, "", href);
        setRoute(href);
      }
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (route.startsWith("/marketplace/queen/")) {
    const legacyId = route.replace("/marketplace/queen/", "");
    return <QueenProfile serviceId={legacyId} />;
  }

  if (route.startsWith("/marketplace/service/")) {
    const serviceId = route.replace("/marketplace/service/", "");
    return <QueenProfile serviceId={serviceId} />;
  }

  const routes = {
    "/": <LandingPage />,
    "/onboarding": <Onboarding />,
    "/pricing": <PricingCalculator />,
    "/marketplace": <Marketplace />,
    "/aicoach": <AICoach />,
    "/ai-coach": <AICoach />,
    "/dashboard": <Dashboard />,
    "/profile": <Profile />,
    "/settings": <Settings />,
    "/roadmap": <Roadmap />,
    "/blog": <Blog />,
    "/login": <Login onNavigate={(to) => {
      const path = `/${to}`;
      window.history.pushState({}, "", path);
      setRoute(path);
    }} />,
    "/signup": <Signup onNavigate={(to) => {
      const path = `/${to}`;
      window.history.pushState({}, "", path);
      setRoute(path);
    }} />,
  };

  return routes[route] || <NotFound />;
}
