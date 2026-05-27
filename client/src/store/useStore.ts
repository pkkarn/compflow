import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  salary: number;
  countryId: string;
  jobTitleId: string;
  country: { id: string; name: string };
  jobTitle: { id: string; title: string };
}

interface AppState {
  employees: Employee[];
  totalEmployees: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  fetchEmployees: (page?: number, search?: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  employees: [],
  totalEmployees: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchEmployees: async (page = 1, search = '') => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/employees', {
        params: { page, limit: 10, search }
      });
      set({
        employees: data.data,
        totalEmployees: data.meta.total,
        currentPage: data.meta.page,
        totalPages: data.meta.totalPages,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch employees', error);
      set({ isLoading: false });
    }
  }
}));
