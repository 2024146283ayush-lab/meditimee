"use client";

import { useState, useRef } from "react";
import { useAuthStore, useSettingsStore } from "@/store";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

export default function ScannerPage() {
  const { language } = useSettingsStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedMedicines, setExtractedMedicines] = useState<ExtractedMedicine[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractMedicines = async () => {
    if (!selectedImage) return;

    setExtracting(true);

    setTimeout(() => {
      const mockExtracted: ExtractedMedicine[] = [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "daily",
          time: "08:00",
        },
        {
          name: "Amoxicillin",
          dosage: "250mg",
          frequency: "daily",
          time: "12:00",
        },
        {
          name: "Vitamin D",
          dosage: "1000IU",
          frequency: "daily",
          time: "09:00",
        },
      ];

      setExtractedMedicines(mockExtracted);
      setExtracting(false);
      toast.success(`Extracted ${mockExtracted.length} medicines`);
    }, 2000);
  };

  const addMedicineToSchedule = (medicine: ExtractedMedicine) => {
    toast.success(`${medicine.name} added to schedule`);
  };

  const addAllMedicines = () => {
    toast.success(`All ${extractedMedicines.length} medicines added to schedule`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t("scanner.title", language)}</h1>
        <p className="text-muted mt-2">Upload a prescription image to extract medicine information</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-card-border">
        <div className="text-center">
          {selectedImage ? (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Prescription"
                className="max-h-64 mx-auto rounded-xl border border-card-border"
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setExtractedMedicines([]);
                  }}
                  className="px-4 py-2 text-muted hover:text-foreground border border-card-border rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={extractMedicines}
                  disabled={extracting}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  {extracting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Extract Medicines
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-card-border rounded-2xl p-12 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                {t("records.uploadFile", language)}
              </p>
              <p className="text-muted">
                Drag and drop your prescription image or click to browse
              </p>
              <p className="text-sm text-muted mt-2">
                Supports: JPG, PNG, PDF
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      </div>

      {extractedMedicines.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Extracted Medicines</h2>
            <button
              onClick={addAllMedicines}
              className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-medium transition-colors"
            >
              Add All to Schedule
            </button>
          </div>

          <div className="space-y-3">
            {extractedMedicines.map((medicine, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-card-border bg-background"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{medicine.name}</p>
                    <p className="text-sm text-muted">
                      {medicine.dosage} • {medicine.frequency} • {medicine.time}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addMedicineToSchedule(medicine)}
                  className="px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl p-6 border border-card-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">Upload Image</h3>
            <p className="text-sm text-muted">Take a photo or upload an image of your prescription</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">AI Extraction</h3>
            <p className="text-sm text-muted">Our AI reads and extracts medicine information</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">Auto Schedule</h3>
            <p className="text-sm text-muted">Medicines are automatically added to your schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
}
