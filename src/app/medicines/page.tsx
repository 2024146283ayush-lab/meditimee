"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useMedicineStore, useSettingsStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

interface MedicineFormData {
  name: string;
  dosage: string;
  quantity: number;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  times: string[];
  startDate: string;
  endDate: string;
  instructions: string;
  category: string;
  color: string;
  refillAt: number;
}

const defaultFormData: MedicineFormData = {
  name: "",
  dosage: "",
  quantity: 30,
  frequency: "daily",
  times: ["09:00"],
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  instructions: "",
  category: "general",
  color: "#3B82F6",
  refillAt: 10,
};

const categories = [
  { value: "general", label: "General", color: "#3B82F6" },
  { value: "pain", label: "Pain Relief", color: "#EF4444" },
  { value: "heart", label: "Heart", color: "#EC4899" },
  { value: "diabetes", label: "Diabetes", color: "#F59E0B" },
  { value: "blood_pressure", label: "Blood Pressure", color: "#8B5CF6" },
  { value: "antibiotics", label: "Antibiotics", color: "#10B981" },
  { value: "vitamins", label: "Vitamins", color: "#06B6D4" },
  { value: "other", label: "Other", color: "#6B7280" },
];

export default function MedicinesPage() {
  const { language } = useSettingsStore();
  const { medicines, setMedicines, addMedicine, removeMedicine } = useMedicineStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MedicineFormData>(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await api.medicines.getAll();
      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newMedicine = await api.medicines.create({
        ...formData,
        remainingQuantity: formData.quantity,
        duration: {
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
        },
      });
      addMedicine(newMedicine);
      setShowForm(false);
      setFormData(defaultFormData);
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirm", language))) return;

    try {
      await api.medicines.delete(id);
      removeMedicine(id);
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const addTime = () => {
    setFormData({ ...formData, times: [...formData.times, "12:00"] });
  };

  const removeTime = (index: number) => {
    setFormData({
      ...formData,
      times: formData.times.filter((_, i) => i !== index),
    });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
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
        <h1 className="text-2xl font-bold text-foreground">{t("medicines.title", language)}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("medicines.addMedicine", language)}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-card-border slide-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("medicines.addMedicine", language)}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.name", language)} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.dosage", language)} *
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., 500mg, 1 tablet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.quantity", language)} *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.frequency", language)} *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.category", language)}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const category = categories.find((c) => c.value === e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      color: category?.color || "#3B82F6",
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.refillAt", language)}
                </label>
                <input
                  type="number"
                  value={formData.refillAt}
                  onChange={(e) => setFormData({ ...formData, refillAt: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("medicines.times", language)} *
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(index, e.target.value)}
                      className="px-3 py-2 rounded-lg border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                    {formData.times.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTime(index)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTime}
                  className="px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Time
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.startDate", language)} *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("medicines.endDate", language)}
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("medicines.instructions", language)}
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                rows={3}
                placeholder="e.g., Take with food, avoid dairy products"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData(defaultFormData);
                }}
                className="px-4 py-2 text-muted hover:text-foreground border border-card-border rounded-xl transition-colors"
              >
                {t("common.cancel", language)}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? t("common.loading", language) : t("common.save", language)}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicines.map((medicine) => (
          <div
            key={medicine._id}
            className="bg-card rounded-2xl p-6 border border-card-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${medicine.color}20` }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={medicine.color}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{medicine.name}</h3>
                  <p className="text-sm text-muted">{medicine.dosage}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(medicine._id)}
                className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{t("medicines.frequency", language)}</span>
                <span className="font-medium text-foreground capitalize">{medicine.frequency}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{t("medicines.times", language)}</span>
                <span className="font-medium text-foreground">{medicine.times.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{t("medicines.remaining", language)}</span>
                <span
                  className={`font-medium ${
                    medicine.remainingQuantity <= medicine.refillAt
                      ? "text-danger"
                      : "text-foreground"
                  }`}
                >
                  {medicine.remainingQuantity} tablets
                </span>
              </div>
            </div>

            {medicine.remainingQuantity <= medicine.refillAt && (
              <div className="p-3 bg-warning/10 rounded-xl border border-warning/20">
                <p className="text-sm text-warning font-medium">
                  ⚠️ Low stock! Only {medicine.remainingQuantity} tablets remaining.
                </p>
              </div>
            )}

            {medicine.instructions && (
              <p className="text-sm text-muted mt-3 italic">📝 {medicine.instructions}</p>
            )}
          </div>
        ))}
      </div>

      {medicines.length === 0 && !showForm && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No medicines added yet</h3>
          <p className="text-muted mb-4">Add your first medicine to start tracking your medications.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            {t("medicines.addMedicine", language)}
          </button>
        </div>
      )}
    </div>
  );
}
