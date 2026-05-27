import { create } from 'zustand';
import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export interface Country { id: string; name: string; }
export interface JobTitle { id: string; title: string; }

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  salary: number;
  countryId: string;
  jobTitleId: string;
  country: Country;
  jobTitle: JobTitle;
}

interface AppState {
  employees: Employee[];
  countries: Country[];
  jobTitles: JobTitle[];
  totalEmployees: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  fetchMetadata: () => Promise<void>;
  fetchEmployees: (page?: number, search?: string) => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  employees: [],
  countries: [],
  jobTitles: [],
  totalEmployees: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchMetadata: async () => {
    try {
      const [countriesRes, jobTitlesRes] = await Promise.all([
        api.get('/employees/countries'),
        api.get('/employees/job-titles')
      ]);
      set({ countries: countriesRes.data, jobTitles: jobTitlesRes.data });
    } catch (error) {
      console.error('Failed to fetch metadata', error);
    }
  },

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
  },

  createEmployee: async (data) => {
    try {
      await api.post('/employees', data);
      await get().fetchEmployees(1, get().searchQuery); // refresh to page 1
    } catch (error) {
      console.error('Failed to create employee', error);
      throw error;
    }
  },

  updateEmployee: async (id, data) => {
    try {
      await api.put(`/employees/${id}`, data);
      await get().fetchEmployees(get().currentPage, get().searchQuery); // refresh current page
    } catch (error) {
      console.error('Failed to update employee', error);
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      await get().fetchEmployees(get().currentPage, get().searchQuery); // refresh current page
    } catch (error) {
      console.error('Failed to delete employee', error);
      throw error;
    }
  }
}));
