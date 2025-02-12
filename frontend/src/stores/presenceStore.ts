import { create } from 'zustand';
import axios from 'axios';

interface Presence {
  id: string;
  type: 'check_in' | 'check_out';
  timestamp: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  method: 'qr_code' | 'nfc' | 'manual';
  notes?: string;
  verified: boolean;
  User?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface PresenceState {
  todayPresences: Presence[];
  userPresences: Presence[];
  loading: boolean;
  error: string | null;
  registerPresence: (data: { type: 'check_in' | 'check_out'; location?: { latitude: number; longitude: number }; method?: string; notes?: string }) => Promise<void>;
  fetchTodayPresences: () => Promise<void>;
  fetchUserPresences: (userId: string, startDate?: string, endDate?: string) => Promise<void>;
  verifyPresence: (id: string) => Promise<void>;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  todayPresences: [],
  userPresences: [],
  loading: false,
  error: null,

  registerPresence: async (data) => {
    try {
      set({ loading: true, error: null });
      await axios.post('/api/presence/register', data);
      await usePresenceStore.getState().fetchTodayPresences();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error registering presence' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchTodayPresences: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get('/api/presence/today');
      set({ todayPresences: response.data.presences });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error fetching today\'s presences' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchUserPresences: async (userId, startDate, endDate) => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/presence/user/${userId}?${params}`);
      set({ userPresences: response.data.presences });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error fetching user presences' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyPresence: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`/api/presence/${id}/verify`);
      await usePresenceStore.getState().fetchTodayPresences();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error verifying presence' });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
