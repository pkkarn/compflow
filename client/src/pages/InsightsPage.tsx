import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';

export function InsightsPage() {
  const { countries, jobTitles, insightsData, fetchMetadata, fetchInsights } = useStore();
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  // Load dropdown metadata if missing
  useEffect(() => {
    if (countries.length === 0 || jobTitles.length === 0) {
      fetchMetadata();
    }
  }, [countries.length, jobTitles.length, fetchMetadata]);

  // Fetch insights when dropdowns change
  useEffect(() => {
    if (selectedCountry) {
      fetchInsights(selectedCountry, selectedJob || undefined);
    }
  }, [selectedCountry, selectedJob, fetchInsights]);

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Filters Area */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <h3 className="text-lg font-bold text-hr-charcoal mb-4">Filter Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country (Required)</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage bg-white"
            >
              <option value="">Select a country...</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title (Optional)</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              disabled={!selectedCountry}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hr-light focus:border-hr-sage bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Job Titles</option>
              {jobTitles.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Area */}
      {selectedCountry && insightsData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <KpiCard 
            title="Minimum Salary" 
            value={insightsData.min} 
            icon={<TrendingDown className="w-6 h-6 text-red-500" />} 
            colorClass="bg-red-50 border-red-100" 
          />
          <KpiCard 
            title="Average Salary" 
            value={insightsData.avg} 
            icon={<Minus className="w-6 h-6 text-blue-500" />} 
            colorClass="bg-blue-50 border-blue-100" 
          />
          <KpiCard 
            title="Maximum Salary" 
            value={insightsData.max} 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />} 
            colorClass="bg-green-50 border-green-100" 
          />
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 border-dashed flex flex-col items-center justify-center p-12">
          <div className="w-16 h-16 bg-hr-mist rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-hr-sage" />
          </div>
          <h3 className="text-xl font-bold text-hr-charcoal">No Data Selected</h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">
            Please select a Country from the dropdown above to view aggregated salary analytics.
          </p>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, icon, colorClass }: { title: string, value: number, icon: React.ReactNode, colorClass: string }) {
  // If the API returned null (meaning no employees found for that specific combo), display N/A
  if (value === null || value === undefined) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
          <div className={`p-2 rounded-xl border bg-gray-50 border-gray-100`}>
             <Minus className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-400">N/A</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transform transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-gray-900">
          ${Math.round(value).toLocaleString()}
        </span>
        <span className="text-sm font-medium text-gray-500">USD/yr</span>
      </div>
    </div>
  );
}
