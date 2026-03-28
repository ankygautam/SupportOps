import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ProductTourCard } from "@/components/showcase/ProductTourCard";
import { ShowcaseBanner } from "@/components/showcase/ShowcaseBanner";
import { Sidebar } from "@/components/layout/Sidebar";
import { ApiStatusNotice } from "@/components/ui/ApiStatusNotice";

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showcaseMode, setShowcaseMode] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.localStorage.getItem("supportops:showcase-mode") !== "off";
  });
  const [showcaseBannerVisible, setShowcaseBannerVisible] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.localStorage.getItem("supportops:showcase-banner-dismissed") !== "true";
  });
  const [tourOpen, setTourOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.localStorage.getItem("supportops:tour-dismissed") !== "true";
  });
  const location = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  function openShowcaseGuide() {
    setShowcaseMode(true);
    setShowcaseBannerVisible(true);
    setTourOpen(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("supportops:showcase-mode", "on");
      window.localStorage.removeItem("supportops:tour-dismissed");
      window.localStorage.removeItem("supportops:showcase-banner-dismissed");
    }
  }

  function toggleShowcaseMode() {
    const next = !showcaseMode;
    setShowcaseMode(next);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("supportops:showcase-mode", next ? "on" : "off");
    }

    if (next) {
      openShowcaseGuide();
      return;
    }

    setShowcaseBannerVisible(false);
    setTourOpen(false);
  }

  return (
    <div className="min-h-screen bg-dashboard-grid">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="min-h-screen lg:pl-[280px]">
        <Header
          onOpenNavigation={() => setMobileNavOpen(true)}
          showcaseMode={showcaseMode}
          onOpenShowcaseGuide={openShowcaseGuide}
          onToggleShowcaseMode={toggleShowcaseMode}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1600px]">
            <ApiStatusNotice compact />
            {showcaseMode && showcaseBannerVisible ? (
              <ShowcaseBanner
                onOpenGuide={() => {
                  openShowcaseGuide();
                }}
                onDismiss={() => {
                  setShowcaseBannerVisible(false);
                  window.localStorage.setItem("supportops:showcase-banner-dismissed", "true");
                }}
              />
            ) : null}
            <Outlet />
          </div>
        </main>
        <ProductTourCard
          open={showcaseMode && tourOpen}
          onClose={() => {
            setTourOpen(false);
            window.localStorage.setItem("supportops:tour-dismissed", "true");
          }}
        />
      </div>
    </div>
  );
}
