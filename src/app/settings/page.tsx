"use client";

import { useAuthStore, useSettingsStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore() as any;
  const {
    language,
    theme,
    largeFonts,
    highContrast,
    voiceNavigation,
    setLanguage,
    setTheme,
    setLargeFonts,
    setHighContrast,
    setVoiceNavigation,
  } = useSettingsStore();

  const handleLanguageChange = async (newLang: "en" | "hi") => {
    setLanguage(newLang);
    try {
      await api.auth.updateSettings({ preferredLanguage: newLang });
      updateUser({ preferredLanguage: newLang });
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      await api.auth.updateSettings({ preferredTheme: newTheme });
      updateUser({ preferredTheme: newTheme });
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const handleLargeFonts = async (enabled: boolean) => {
    setLargeFonts(enabled);
    if (enabled) {
      document.documentElement.classList.add("large-fonts");
    } else {
      document.documentElement.classList.remove("large-fonts");
    }
    try {
      await api.auth.updateSettings({
        accessibilitySettings: { largeFonts: enabled, highContrast, voiceNavigation },
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleHighContrast = async (enabled: boolean) => {
    setHighContrast(enabled);
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    try {
      await api.auth.updateSettings({
        accessibilitySettings: { largeFonts, highContrast: enabled, voiceNavigation },
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleVoiceNavigation = async (enabled: boolean) => {
    setVoiceNavigation(enabled);
    try {
      await api.auth.updateSettings({
        accessibilitySettings: { largeFonts, highContrast, voiceNavigation: enabled },
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("settings.title", language)}</h1>

      <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("settings.language", language)}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                language === "en"
                  ? "bg-primary text-white"
                  : "bg-background border border-card-border text-foreground hover:bg-muted/10"
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange("hi")}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                language === "hi"
                  ? "bg-primary text-white"
                  : "bg-background border border-card-border text-foreground hover:bg-muted/10"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("settings.theme", language)}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange("light")}
              className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                theme === "light"
                  ? "bg-primary text-white"
                  : "bg-background border border-card-border text-foreground hover:bg-muted/10"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-primary text-white"
                  : "bg-background border border-card-border text-foreground hover:bg-muted/10"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("settings.accessibility", language)}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("settings.largeFonts", language)}</p>
                <p className="text-sm text-muted">Increase text size for better readability</p>
              </div>
              <button
                onClick={() => handleLargeFonts(!largeFonts)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  largeFonts ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    largeFonts ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("settings.highContrast", language)}</p>
                <p className="text-sm text-muted">Increase contrast for better visibility</p>
              </div>
              <button
                onClick={() => handleHighContrast(!highContrast)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  highContrast ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    highContrast ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t("settings.voiceNavigation", language)}</p>
                <p className="text-sm text-muted">Enable voice guidance for navigation</p>
              </div>
              <button
                onClick={() => handleVoiceNavigation(!voiceNavigation)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  voiceNavigation ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    voiceNavigation ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-card-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("settings.profile", language)}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-muted/10 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-muted/10 text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-danger/10 hover:bg-danger/20 text-danger rounded-xl font-medium transition-colors"
          >
            {t("settings.logout", language)}
          </button>
        </div>
      </div>
    </div>
  );
}
