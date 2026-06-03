import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Medicine, MedicineSchedule, Appointment, HealthRecord, FamilyMember, ChatMessage, DashboardData } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'meditime-auth' }
  )
);

interface MedicineState {
  medicines: Medicine[];
  todaySchedules: MedicineSchedule[];
  stats: { adherence: number; total: number; taken: number } | null;
  setMedicines: (medicines: Medicine[]) => void;
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  removeMedicine: (id: string) => void;
  setTodaySchedules: (schedules: MedicineSchedule[]) => void;
  updateScheduleStatus: (id: string, status: string) => void;
  setStats: (stats: { adherence: number; total: number; taken: number }) => void;
}

export const useMedicineStore = create<MedicineState>()((set) => ({
  medicines: [],
  todaySchedules: [],
  stats: null,
  setMedicines: (medicines) => set({ medicines }),
  addMedicine: (medicine) => set((state) => ({ medicines: [medicine, ...state.medicines] })),
  updateMedicine: (id, updates) =>
    set((state) => ({
      medicines: state.medicines.map((m) => (m._id === id ? { ...m, ...updates } : m)),
    })),
  removeMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((m) => m._id !== id),
    })),
  setTodaySchedules: (schedules) => set({ todaySchedules: schedules }),
  updateScheduleStatus: (id, status) =>
    set((state) => ({
      todaySchedules: state.todaySchedules.map((s) =>
        s._id === id ? { ...s, status: status as any } : s
      ),
    })),
  setStats: (stats) => set({ stats }),
}));

interface AppState {
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  familyMembers: FamilyMember[];
  chatMessages: ChatMessage[];
  dashboardData: DashboardData | null;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  setHealthRecords: (records: HealthRecord[]) => void;
  addHealthRecord: (record: HealthRecord) => void;
  setFamilyMembers: (members: FamilyMember[]) => void;
  addFamilyMember: (member: FamilyMember) => void;
  removeFamilyMember: (id: string) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setDashboardData: (data: DashboardData) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  appointments: [],
  healthRecords: [],
  familyMembers: [],
  chatMessages: [],
  dashboardData: null,
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [appointment, ...state.appointments] })),
  setHealthRecords: (records) => set({ healthRecords: records }),
  addHealthRecord: (record) =>
    set((state) => ({ healthRecords: [record, ...state.healthRecords] })),
  setFamilyMembers: (members) => set({ familyMembers: members }),
  addFamilyMember: (member) =>
    set((state) => ({ familyMembers: [...state.familyMembers, member] })),
  removeFamilyMember: (id) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter((m) => m._id !== id),
    })),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setDashboardData: (data) => set({ dashboardData: data }),
}));

interface SettingsState {
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
  largeFonts: boolean;
  highContrast: boolean;
  voiceNavigation: boolean;
  setLanguage: (lang: 'en' | 'hi') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLargeFonts: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setVoiceNavigation: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      largeFonts: false,
      highContrast: false,
      voiceNavigation: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setLargeFonts: (largeFonts) => set({ largeFonts }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setVoiceNavigation: (voiceNavigation) => set({ voiceNavigation }),
    }),
    { name: 'meditime-settings' }
  )
);
