import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { appFeatureFlags } from "@/app/config/features";
import { storageKeys } from "@/app/config/storage";
import { Header } from "@/components/layout/Header";
import { ProductTourCard } from "@/components/showcase/ProductTourCard";
import { ShowcaseBanner } from "@/components/showcase/ShowcaseBanner";
import { Sidebar } from "@/components/layout/Sidebar";
import { ApiStatusNotice } from "@/components/ui/ApiStatusNotice";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/lib/browserStorage";

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showcaseMode, setShowcaseMode] = useState(() => {
    if (!appFeatureFlags.showcaseMode) {
      return false;
    }
    return getLocalStorageItem(storageKeys.showcaseMode) !== "off";
  });
  const [showcaseBannerVisible, setShowcaseBannerVisible] = useState(() => {
    if (!appFeatureFlags.showcaseMode) {
      return false;
    }
    return getLocalStorageItem(storageKeys.showcaseBannerDismissed) !== "true";
  });
  const [tourOpen, setTourOpen] = useState(() => {
    if (!appFeatureFlags.showcaseMode) {
      return false;
    }
    return getLocalStorageItem(storageKeys.showcaseTourDismissed) !== "true";
  });
  const location = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  function openShowcaseGuide() {
    if (!appFeatureFlags.showcaseMode) {
      return;
    }
    setShowcaseMode(true);
    setShowcaseBannerVisible(true);
    setTourOpen(true);
    setLocalStorageItem(storageKeys.showcaseMode, "on");
    removeLocalStorageItem(storageKeys.showcaseTourDismissed);
    removeLocalStorageItem(storageKeys.showcaseBannerDismissed);
  }

  function toggleShowcaseMode() {
    if (!appFeatureFlags.showcaseMode) {
      return;
    }
    const next = !showcaseMode;
    setShowcaseMode(next);
    setLocalStorageItem(storageKeys.showcaseMode, next ? "on" : "off");

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
          showcaseAvailable={appFeatureFlags.showcaseMode}
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
                  setLocalStorageItem(storageKeys.showcaseBannerDismissed, "true");
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
            setLocalStorageItem(storageKeys.showcaseTourDismissed, "true");
          }}
        />
      </div>
    </div>
  );
}
