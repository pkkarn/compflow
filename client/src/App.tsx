import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// Placeholder Pages
const EmployeesPage = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-hr-charcoal">Employee Directory</h2>
      <p className="text-gray-500 mt-2">The employee data table will be built here.</p>
    </div>
  </div>
);

const InsightsPage = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-hr-charcoal">Salary Insights</h2>
      <p className="text-gray-500 mt-2">Analytical charts and KPIs will be built here.</p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/employees" replace />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
