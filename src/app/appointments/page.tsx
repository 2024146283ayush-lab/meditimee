"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useAppStore, useSettingsStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
  const { language } = useSettingsStore();
  const { appointments, setAppointments, addAppointment } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    hospital: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    notes: "",
    reminderBefore: 24,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await api.appointments.getAll();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAppointment = await api.appointments.create(formData);
      addAppointment(newAppointment);
      setShowForm(false);
      setFormData({
        doctorName: "",
        specialty: "",
        hospital: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        notes: "",
        reminderBefore: 24,
      });
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirm", language))) return;
    try {
      await api.appointments.delete(id);
      setAppointments(appointments.filter((a) => a._id !== id));
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.appointments.update(id, { status });
      setAppointments(
        appointments.map((a) => (a._id === id ? { ...a, status: status as any } : a))
      );
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const completedAppointments = appointments.filter((a) => a.status === "completed");

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
        <h1 className="text-2xl font-bold text-foreground">{t("appointments.title", language)}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("appointments.addAppointment", language)}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-card-border slide-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("appointments.addAppointment", language)}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("appointments.doctorName", language)} *
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("appointments.specialty", language)} *
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., Cardiologist, General Physician"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("appointments.hospital", language)} *
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("appointments.date", language)} *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("appointments.time", language)} *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reminder Before (hours)
                </label>
                <select
                  value={formData.reminderBefore}
                  onChange={(e) => setFormData({ ...formData, reminderBefore: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>2 days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("appointments.notes", language)}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-muted hover:text-foreground border border-card-border rounded-xl transition-colors"
              >
                {t("common.cancel", language)}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
              >
                {t("common.save", language)}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{t("appointments.upcoming", language)}</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-2xl border border-card-border">
            <p className="text-muted">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-card rounded-2xl p-4 border border-card-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appointment.doctorName}</p>
                    <p className="text-sm text-muted">{appointment.specialty} • {appointment.hospital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {new Date(appointment.date).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted">{appointment.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, "completed")}
                      className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                      title="Mark as completed"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {completedAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{t("appointments.completed", language)}</h2>
          <div className="space-y-3">
            {completedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-card rounded-2xl p-4 border border-card-border opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appointment.doctorName}</p>
                      <p className="text-sm text-muted">{appointment.specialty} • {appointment.hospital}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted">
                    {new Date(appointment.date).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
