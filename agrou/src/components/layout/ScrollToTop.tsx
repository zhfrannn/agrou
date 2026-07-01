import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Disable browser's automatic scroll restoration so we control it fully
if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // First immediate attempt
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Double rAF ensures we run after the browser has painted the new route
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    });

    // Final fallback for any lazy-loaded content that shifts layout
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 50);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
