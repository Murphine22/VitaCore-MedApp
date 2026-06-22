import { apiClient, USE_API, setToken } from './apiClient.js';
import { demoDb } from './demoDb.js';

// Small artificial delay so demo mode feels like a real network round-trip.
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

function resource(name) {
  return {
    async list(params = {}) {
      if (USE_API) {
        const { data } = await apiClient.get(`/${name}`, { params });
        return data;
      }
      await delay();
      return demoDb.list(name, params);
    },
    async get(id) {
      if (USE_API) {
        const { data } = await apiClient.get(`/${name}/${id}`);
        return data;
      }
      await delay();
      return demoDb.get(name, id);
    },
    async create(body) {
      if (USE_API) {
        const { data } = await apiClient.post(`/${name}`, body);
        return data;
      }
      await delay();
      return demoDb.create(name, body);
    },
    async update(id, body) {
      if (USE_API) {
        const { data } = await apiClient.put(`/${name}/${id}`, body);
        return data;
      }
      await delay();
      return demoDb.update(name, id, body);
    },
    async remove(id) {
      if (USE_API) {
        const { data } = await apiClient.delete(`/${name}/${id}`);
        return data;
      }
      await delay();
      return demoDb.remove(name, id);
    },
  };
}

export const dataService = {
  mode: USE_API ? 'api' : 'demo',

  auth: {
    async login(payload) {
      let result;
      if (USE_API) {
        const { data } = await apiClient.post('/auth/login', payload);
        result = data;
      } else {
        await delay();
        result = demoDb.authLogin(payload);
      }
      setToken(result.token);
      return result;
    },
    async register(payload) {
      let result;
      if (USE_API) {
        const { data } = await apiClient.post('/auth/register', payload);
        result = data;
      } else {
        await delay();
        result = demoDb.authRegister(payload);
      }
      setToken(result.token);
      return result;
    },
    logout() {
      setToken(null);
    },
  },

  patients: resource('patients'),
  doctors: resource('doctors'),
  departments: resource('departments'),
  appointments: resource('appointments'),
  invoices: resource('invoices'),
  prescriptions: resource('prescriptions'),

  dashboard: {
    async stats() {
      if (USE_API) {
        const { data } = await apiClient.get('/dashboard/stats');
        return data;
      }
      await delay();
      return demoDb.stats();
    },
  },

  resetDemo() {
    if (!USE_API) demoDb.reset();
  },
};
