
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List } from 'lucide-react';
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
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-gray-100">
      <div className="flex items-center gap-4">
        {viewMode === 'list' && (
          <>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedJobIds.size > 0 && selectedJobIds.size === jobs.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded-md h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-600 font-medium">
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
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1.5 shadow-inner">
              <TabsTrigger 
                value="list" 
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200 data-[state=active]:hover:bg-blue-700 data-[state=active]:transform data-[state=active]:scale-105"
              >
                <List size={16} />
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kanban" 
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200 data-[state=active]:hover:bg-blue-700 data-[state=active]:transform data-[state=active]:scale-105"
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Add a New Job
        </Button>
      </div>
    </div>
  );
};

export default JobsControlBar;
