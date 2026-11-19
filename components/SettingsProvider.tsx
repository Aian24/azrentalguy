"use client";

import React, { useEffect } from "react";
import { getStoredSettings, applySettingsToDOM } from "@/lib/settings";

export default function SettingsProvider() {
  useEffect(() => {
    const apply = () => {
      const s = getStoredSettings();
      applySettingsToDOM(s);
    };

    apply();
    window.addEventListener("app_settings_updated", apply);
    return () => window.removeEventListener("app_settings_updated", apply);
  }, []);

  return null;
}

