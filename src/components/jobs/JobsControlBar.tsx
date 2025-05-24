
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg shadow-gray-900/5 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border border-gray-200/60">
      <div className="flex items-center gap-6">
        {viewMode === 'list' && (
          <>
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
          </>
        )}
        
        {/* Enhanced View Toggle with modern styling */}
        <div className="ml-2 md:ml-6">
          <Tabs 
            defaultValue="list" 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}
            className="w-[280px]"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-2 shadow-inner border border-gray-200/60">
              <TabsTrigger 
                value="list" 
                className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/25 hover:bg-gray-200/80 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 data-[state=active]:transform data-[state=active]:scale-105 text-gray-600 hover:text-gray-900"
              >
                <List size={16} />
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kanban" 
                className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/25 hover:bg-gray-200/80 data-[state=active]:hover:from-blue-700 data-[state=active]:hover:to-blue-800 data-[state=active]:transform data-[state=active]:scale-105 text-gray-600 hover:text-gray-900"
              >
                <Kanban size={16} />
                <span>Kanban View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex items-center">
        <Button 
          onClick={onOpenAddJobDialog} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Job
        </Button>
      </div>
    </div>
  );
};

export default JobsControlBar;
