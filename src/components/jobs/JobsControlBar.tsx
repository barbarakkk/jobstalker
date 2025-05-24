
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Kanban, List, Plus } from 'lucide-react';
import { useJobs } from '@/context/jobs/JobsContext';

interface JobsControlBarProps {
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
  onOpenAddJobDialog: () => void;
}

const JobsControlBar: React.FC<JobsControlBarProps> = ({ 
  viewMode, 
  setViewMode, 
  onOpenAddJobDialog 
}) => {
  const { jobs, selectedJobIds, handleSelectAll } = useJobs();

  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-gray-900/5 mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 border border-gray-200/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {viewMode === 'list' && (
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedJobIds.size > 0 && selectedJobIds.size === jobs.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded-lg h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 shadow-sm"
            />
            <span className="text-sm text-gray-700 font-semibold">
              {selectedJobIds.size} selected
            </span>
          </div>
        )}
        
        {/* Enhanced View Toggle with proper spacing */}
        <div className="flex-shrink-0">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as 'list' | 'kanban')}
            className="grid grid-cols-2 gap-1 p-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 w-full sm:w-auto min-w-[280px]"
          >
            <ToggleGroupItem 
              value="list" 
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-600 data-[state=on]:to-blue-700 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-blue-600/25 hover:bg-gray-200/80 data-[state=on]:hover:from-blue-700 data-[state=on]:hover:to-blue-800 text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              <List size={16} className="flex-shrink-0" />
              <span>List View</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="kanban" 
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-600 data-[state=on]:to-blue-700 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-blue-600/25 hover:bg-gray-200/80 data-[state=on]:hover:from-blue-700 data-[state=on]:hover:to-blue-800 text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              <Kanban size={16} className="flex-shrink-0" />
              <span>Kanban View</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="flex items-center flex-shrink-0">
        <Button 
          onClick={onOpenAddJobDialog} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          Add New Job
        </Button>
      </div>
    </div>
  );
};

export default JobsControlBar;
