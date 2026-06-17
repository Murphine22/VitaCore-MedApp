import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataService } from '../lib/dataService.js';
import { setToken } from '../lib/apiClient.js';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,

      async login(payload) {
        set({ loading: true });
        try {
          const { user, token } = await dataService.auth.login(payload);
          set({ user, token, loading: false });
          return user;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      async register(payload) {
        set({ loading: true });
        try {
          const { user, token } = await dataService.auth.register(payload);
          set({ user, token, loading: false });
          return user;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout() {
        dataService.auth.logout();
        set({ user: null, token: null });
      },
    }),
    {
      name: 'vitacore_auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token);
      },
    }
  )
);
