"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useAppStore, useSettingsStore } from "@/store";
import { api } from "@/lib/api";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

export default function FamilyPage() {
  const { language } = useSettingsStore();
  const { familyMembers, setFamilyMembers, addFamilyMember, removeFamilyMember } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: "",
    isEmergencyContact: false,
    notifyOnMissed: true,
  });

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const data = await api.family.getAll();
      setFamilyMembers(data);
    } catch (error) {
      console.error("Failed to fetch family members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMember = await api.family.create(formData);
      addFamilyMember(newMember);
      setShowForm(false);
      setFormData({
        name: "",
        relationship: "",
        email: "",
        phone: "",
        isEmergencyContact: false,
        notifyOnMissed: true,
      });
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("common.confirm", language))) return;
    try {
      await api.family.delete(id);
      removeFamilyMember(id);
      toast.success(t("common.success", language));
    } catch (error: any) {
      toast.error(error.message || t("common.error", language));
    }
  };

  const relationships = [
    "Spouse",
    "Son",
    "Daughter",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Grandchild",
    "Caregiver",
    "Other",
  ];

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
        <h1 className="text-2xl font-bold text-foreground">{t("family.title", language)}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("family.addMember", language)}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-card-border slide-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("family.addMember", language)}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("family.name", language)} *
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
                  {t("family.relationship", language)} *
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select relationship</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("family.email", language)}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("family.phone", language)}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEmergencyContact}
                  onChange={(e) => setFormData({ ...formData, isEmergencyContact: e.target.checked })}
                  className="w-5 h-5 rounded border-card-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">{t("family.emergencyContact", language)}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyOnMissed}
                  onChange={(e) => setFormData({ ...formData, notifyOnMissed: e.target.checked })}
                  className="w-5 h-5 rounded border-card-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">{t("family.notifyOnMissed", language)}</span>
              </label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((member) => (
          <div
            key={member._id}
            className="bg-card rounded-2xl p-6 border border-card-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted">{member.relationship}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(member._id)}
                className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {member.email && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-muted">{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-muted">{member.phone}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              {member.isEmergencyContact && (
                <span className="px-2 py-1 text-xs font-medium bg-danger/10 text-danger rounded-lg">
                  Emergency
                </span>
              )}
              {member.notifyOnMissed && (
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg">
                  Notifications On
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {familyMembers.length === 0 && !showForm && (
        <div className="text-center py-12 bg-card rounded-2xl border border-card-border">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No family members added</h3>
          <p className="text-muted mb-4">Add family members to notify them about your medication status.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            {t("family.addMember", language)}
          </button>
        </div>
      )}
    </div>
  );
}
