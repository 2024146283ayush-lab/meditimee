import { useAuthStore } from '@/store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; name: string; phone?: string }) =>
      fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: () => fetchAPI('/auth/me'),
    updateSettings: (settings: any) =>
      fetchAPI('/auth/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },
  medicines: {
    getAll: () => fetchAPI('/medicines'),
    create: (data: any) =>
      fetchAPI('/medicines', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI(`/medicines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI(`/medicines/${id}`, { method: 'DELETE' }),
    getTodaySchedule: () => fetchAPI('/medicines/schedule/today'),
    updateScheduleStatus: (id: string, status: string, notes?: string) =>
      fetchAPI(`/medicines/schedule/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }),
    getStats: () => fetchAPI('/medicines/stats'),
  },
  appointments: {
    getAll: () => fetchAPI('/appointments'),
    create: (data: any) =>
      fetchAPI('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI(`/appointments/${id}`, { method: 'DELETE' }),
    getUpcoming: () => fetchAPI('/appointments/upcoming'),
  },
  records: {
    getAll: () => fetchAPI('/records'),
    create: (data: any) =>
      fetchAPI('/records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI(`/records/${id}`, { method: 'DELETE' }),
  },
  family: {
    getAll: () => fetchAPI('/family'),
    create: (data: any) =>
      fetchAPI('/family', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI(`/family/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI(`/family/${id}`, { method: 'DELETE' }),
  },
};
