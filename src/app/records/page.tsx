"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useAppStore, useSettingsStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function RecordsPage() {
  const { language } = useSettingsStore();
  const { healthRecords, setHealthRecords, addHealthRecord } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    type: "prescription" as const,
    notes: "",
    date: new Date().toISOString().split("T")[0],
    doctorName: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await api.records.getAll();
      setHealthRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecord = await api.records.create(formData);
      addHealthRecord(newRecord);
      setShowForm(false);
      setFormData({
        title: "",
        type: "prescription",
        notes: "",
        date: new Date().toISOString().split("T")[0],
        doctorName: "",
      });
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirm", language))) return;
    try {
      await api.records.delete(id);
      setHealthRecords(healthRecords.filter((r) => r._id !== id));
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      case "report":
        return "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
      case "lab_test":
        return "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z";
      default:
        return "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prescription":
        return "text-primary bg-primary/10";
      case "report":
        return "text-secondary bg-secondary/10";
      case "lab_test":
        return "text-accent bg-accent/10";
      default:
        return "text-muted bg-muted/10";
    }
  };

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
        <h1 className="text-2xl font-bold text-foreground">{t("records.title", language)}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("records.addRecord", language)}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-card-border slide-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("records.addRecord", language)}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="prescription">{t("records.prescription", language)}</option>
                  <option value="report">{t("records.report", language)}</option>
                  <option value="lab_test">{t("records.labTest", language)}</option>
                  <option value="doctor_note">{t("records.doctorNote", language)}</option>
                  <option value="other">{t("records.other", language)}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
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

      <div className="space-y-3">
        {healthRecords.map((record) => (
          <div
            key={record._id}
            className="bg-card rounded-2xl p-4 border border-card-border flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(record.type)}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTypeIcon(record.type)} />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground">{record.title}</p>
                <p className="text-sm text-muted">
                  {record.type.replace("_", " ").charAt(0).toUpperCase() + record.type.replace("_", " ").slice(1)}
                  {record.doctorName && ` • Dr. ${record.doctorName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">
                {new Date(record.date).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={() => handleDelete(record._id)}
                className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {healthRecords.length === 0 && !showForm && (
        <div className="text-center py-12 bg-card rounded-2xl border border-card-border">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No health records yet</h3>
          <p className="text-muted mb-4">Add your prescriptions, reports, and medical documents.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            {t("records.addRecord", language)}
          </button>
        </div>
      )}
    </div>
  );
}
