"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useMedicineStore, useAppStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import { speakMedicineReminder, playNotificationSound } from "@/lib/voice";

interface DashboardStats {
  adherence: number;
  total: number;
  taken: number;
}

export default function DashboardPage() {
  const { user, language } = useAuthStore() as any;
  const { todaySchedules, setTodaySchedules, stats, setStats } = useMedicineStore();
  const { appointments, setAppointments } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [schedules, statsData, appointmentsData] = await Promise.all([
        api.medicines.getTodaySchedule(),
        api.medicines.getStats(),
        api.appointments.getUpcoming(),
      ]);
      setTodaySchedules(schedules);
      setStats(statsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = async (scheduleId: string) => {
    try {
      await api.medicines.updateScheduleStatus(scheduleId, "taken");
      playNotificationSound();
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to mark as taken:", error);
    }
  };

  const handleSnooze = async (scheduleId: string) => {
    try {
      await api.medicines.updateScheduleStatus(scheduleId, "snoozed");
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to snooze:", error);
    }
  };

  const pendingMedicines = todaySchedules.filter((s) => s.status === "pending");
  const completedMedicines = todaySchedules.filter((s) => s.status === "taken");

  const healthScore = stats ? Math.min(100, Math.round(stats.adherence * 0.8 + (user?.streak || 0) * 2)) : 75;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.title", language)}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted mt-1">
            {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-primary">{stats?.taken || 0}</span>
          <span className="text-muted text-sm">day streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">{t("dashboard.healthScore", language)}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{healthScore}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div
                className="bg-secondary h-2 rounded-full transition-all"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">{t("dashboard.adherence", language)}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats?.adherence || 0}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats?.adherence || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Today&apos;s Medicines</p>
              <p className="text-3xl font-bold text-foreground mt-1">{todaySchedules.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <p className="text-muted text-sm mt-4">
            {completedMedicines.length} completed, {pendingMedicines.length} pending
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">{t("dashboard.streak", language)}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stats?.taken || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
          <p className="text-muted text-sm mt-4">Keep it up!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t("dashboard.todayMedicines", language)}</h2>
            <a href="/medicines" className="text-primary text-sm hover:underline">
              {t("dashboard.viewAll", language)}
            </a>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-muted">{t("dashboard.noMedicines", language)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.slice(0, 5).map((schedule) => (
                <div
                  key={schedule._id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    schedule.status === "taken"
                      ? "bg-secondary/5 border-secondary/20"
                      : schedule.status === "pending"
                      ? "bg-background border-card-border"
                      : "bg-muted/5 border-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        schedule.status === "taken"
                          ? "bg-secondary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {schedule.status === "taken" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {(schedule.medicineId as any)?.name || "Medicine"}
                      </p>
                      <p className="text-sm text-muted">
                        {(schedule.medicineId as any)?.dosage} •{" "}
                        {new Date(schedule.scheduledTime).toLocaleTimeString(language === "hi" ? "hi-IN" : "en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {schedule.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSnooze(schedule._id)}
                        className="px-3 py-1.5 text-sm text-muted hover:text-foreground border border-card-border rounded-lg hover:bg-muted/10 transition-colors"
                      >
                        {t("medicines.snoozed", language)}
                      </button>
                      <button
                        onClick={() => handleMarkTaken(schedule._id)}
                        className="px-3 py-1.5 text-sm text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                      >
                        {t("medicines.taken", language)}
                      </button>
                    </div>
                  )}

                  {schedule.status === "taken" && (
                    <span className="text-sm text-secondary font-medium">
                      ✓ {t("medicines.taken", language)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t("dashboard.upcomingReminders", language)}</h2>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 4).map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-3 rounded-xl border border-card-border bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{appointment.doctorName}</p>
                      <p className="text-xs text-muted">{appointment.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(appointment.date).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted">{appointment.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-card-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Medication Adherence</h2>
        <div className="flex items-end gap-2 h-40">
          {[65, 78, 82, 90, 85, 92, stats?.adherence || 88].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary/20 rounded-t-lg relative"
                style={{ height: `${value}%` }}
              >
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all"
                  style={{ height: "100%" }}
                />
              </div>
              <span className="text-xs text-muted mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
