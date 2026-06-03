export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  preferredLanguage: 'en' | 'hi';
  preferredTheme: 'light' | 'dark';
  accessibilitySettings: {
    largeFonts: boolean;
    highContrast: boolean;
    voiceNavigation: boolean;
  };
  createdAt: string;
}

export interface Medicine {
  _id: string;
  userId: string;
  name: string;
  dosage: string;
  quantity: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  duration: {
    startDate: string;
    endDate?: string;
    days?: number[];
  };
  instructions?: string;
  category: string;
  color: string;
  remainingQuantity: number;
  refillAt: number;
  isActive: boolean;
  createdAt: string;
}

export interface MedicineSchedule {
  _id: string;
  userId: string;
  medicineId: string;
  medicine?: Medicine;
  scheduledTime: string;
  status: 'pending' | 'taken' | 'skipped' | 'snoozed';
  takenAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  notes?: string;
  reminderBefore: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface HealthRecord {
  _id: string;
  userId: string;
  title: string;
  type: 'prescription' | 'report' | 'lab_test' | 'doctor_note' | 'other';
  fileUrl?: string;
  notes?: string;
  date: string;
  doctorName?: string;
  createdAt: string;
}

export interface FamilyMember {
  _id: string;
  userId: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isEmergencyContact: boolean;
  notifyOnMissed: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  type: 'ambulance' | 'hospital' | 'police' | 'fire' | 'custom';
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  language: 'en' | 'hi';
  createdAt: string;
}

export interface HealthScore {
  overall: number;
  medicationAdherence: number;
  appointmentCompliance: number;
  streak: number;
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface WearableData {
  heartRate?: number;
  steps?: number;
  sleepHours?: number;
  bloodOxygen?: number;
  lastUpdated: string;
}

export interface DashboardData {
  todayMedicines: MedicineSchedule[];
  upcomingReminders: MedicineSchedule[];
  healthScore: HealthScore;
  adherencePercentage: number;
  recentActivity: any[];
  familyUpdates: any[];
  wearableData?: WearableData;
}
