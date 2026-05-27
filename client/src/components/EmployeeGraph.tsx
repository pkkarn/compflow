import { useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '../store/useStore';

export function EmployeeGraph() {
  const { graphData, fetchGraphData, searchQuery } = useStore();
  const graphRef = useRef<any>();

  // Fetch graph data whenever the search query changes
  useEffect(() => {
    fetchGraphData(searchQuery);
  }, [searchQuery, fetchGraphData]);

  const handleNodeColor = useCallback((node: any) => {
    switch (node.type) {
      case 'company': return '#1d4ed8'; // blue-700
      case 'country': return '#10b981'; // emerald-500
      case 'job': return '#f59e0b';     // amber-500
      case 'employee': return '#64748b'; // slate-500
      default: return '#94a3b8';
    }
  }, []);

  if (!graphData) {
    return <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200 animate-pulse text-gray-400">Loading graph structure...</div>;
  }

  return (
    <div className="flex-1 w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative animate-in fade-in duration-500">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={handleNodeColor}
        nodeVal="val"
        linkColor={() => '#cbd5e1'}
        linkWidth={1.5}
        d3VelocityDecay={0.3}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200 text-sm">
        <h4 className="font-semibold text-gray-700 mb-2">Graph Legend</h4>
        <div className="flex flex-col space-y-2">
          <LegendItem color="bg-blue-700" label="Company Root" />
          <LegendItem color="bg-emerald-500" label="Countries" />
          <LegendItem color="bg-amber-500" label="Job Titles (Avg Salary)" />
          {searchQuery && <LegendItem color="bg-slate-500" label="Matching Employees" />}
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  );
}
