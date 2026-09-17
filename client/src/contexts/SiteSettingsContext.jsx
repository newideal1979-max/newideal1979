import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { staticSiteConfig } from "../lib/siteConfig";

const SiteSettingsContext = createContext(staticSiteConfig);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(staticSiteConfig);

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => setSettings({ ...staticSiteConfig, ...data.data }))
      .catch(() => setSettings(staticSiteConfig)); // API not reachable yet — fall back quietly
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
