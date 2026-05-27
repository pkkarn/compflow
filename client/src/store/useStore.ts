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

export interface SalaryInsights {
  min: number;
  max: number;
  avg: number;
  currency: string;
}

export interface GraphData {
  nodes: any[];
  links: any[];
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
  insightsData: SalaryInsights | null;
  graphData: GraphData | null;

  // Actions
  setSearchQuery: (query: string) => void;
  fetchMetadata: () => Promise<void>;
  fetchEmployees: (page?: number, search?: string) => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  fetchInsights: (countryId: string, jobTitleId?: string) => Promise<void>;
  fetchGraphData: (search?: string) => Promise<void>;
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
  insightsData: null,
  graphData: null,

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
  },

  fetchInsights: async (countryId, jobTitleId) => {
    try {
      let url = `/insights/country/${countryId}`;
      if (jobTitleId) {
        url += `/job-title/${jobTitleId}`;
      }
      const { data } = await api.get(url);
      set({ insightsData: data });
    } catch (error) {
      console.error('Failed to fetch insights', error);
      set({ insightsData: null });
    }
  },

  fetchGraphData: async (search = '') => {
    try {
      const { data } = await api.get('/employees/graph', {
        params: { search }
      });
      set({ graphData: data });
    } catch (error) {
      console.error('Failed to fetch graph data', error);
      set({ graphData: null });
    }
  }
}));
