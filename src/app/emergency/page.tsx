"use client";

import { useState } from "react";
import { useAuthStore, useSettingsStore } from "@/store";
import { t } from "@/lib/translations";
import { speakEmergencyAlert, playEmergencySound } from "@/lib/voice";
import toast from "react-hot-toast";

export default function EmergencyPage() {
  const { language } = useSettingsStore();
  const [sending, setSending] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleEmergency = async (type: string) => {
    setSending(true);
    playEmergencySound();

    try {
      const loc = await getLocation();
      setLocation(loc);

      toast.success(`Emergency ${type} alert sent!`);
      speakEmergencyAlert(language);

      setTimeout(() => {
        setSending(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to get location. Alert sent without location.");
      speakEmergencyAlert(language);
      setTimeout(() => {
        setSending(false);
      }, 2000);
    }
  };

  const emergencyContacts = [
    {
      id: "ambulance",
      title: t("emergency.callAmbulance", language),
      number: "108",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "danger",
      bgColor: "bg-danger/10",
      textColor: "text-danger",
    },
    {
      id: "hospital",
      title: t("emergency.callHospital", language),
      number: "102",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      id: "police",
      title: t("emergency.callPolice", language),
      number: "100",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      color: "accent",
      bgColor: "bg-accent/10",
      textColor: "text-accent",
    },
    {
      id: "fire",
      title: t("emergency.callFire", language),
      number: "101",
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      color: "warning",
      bgColor: "bg-warning/10",
      textColor: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t("emergency.title", language)}</h1>
        <p className="text-muted mt-2">Press the button for immediate assistance</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleEmergency("SOS")}
          disabled={sending}
          className="w-40 h-40 rounded-full bg-danger text-white flex flex-col items-center justify-center shadow-lg emergency-pulse hover:bg-danger/90 transition-colors disabled:opacity-50"
        >
          {sending ? (
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full spinner" />
          ) : (
            <>
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-lg font-bold">SOS</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handleEmergency(contact.id)}
            disabled={sending}
            className={`p-6 rounded-2xl border border-card-border bg-card hover:shadow-lg transition-all text-left ${contact.bgColor}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${contact.bgColor} flex items-center justify-center`}>
                <svg className={`w-7 h-7 ${contact.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={contact.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{contact.title}</h3>
                <p className="text-2xl font-bold text-foreground">{contact.number}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 border border-card-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("emergency.sendAlert", language)}</h2>
        <p className="text-muted mb-4">
          Send an emergency alert to your family members with your current location.
        </p>
        <button
          onClick={() => handleEmergency("family")}
          disabled={sending}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t("emergency.shareLocation", language)}
        </button>
      </div>

      {location && (
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <h3 className="font-semibold text-foreground mb-2">Your Location</h3>
          <p className="text-sm text-muted">
            Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          </p>
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 border border-card-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-muted">Stay calm and remain on the line with emergency services.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-muted">Provide your exact location and describe the emergency.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-muted">Keep your medicine list handy for emergency responders.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span className="text-muted">If possible, unlock your door for emergency responders.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
