
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
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex items-center gap-2">
        {viewMode === 'list' && (
          <>
            <input
              type="checkbox"
              checked={selectedJobIds.size > 0 && selectedJobIds.size === jobs.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              {selectedJobIds.size} selected
            </span>
          </>
        )}
        
        {/* Updated View Toggle with modern styling */}
        <div className="ml-4 md:ml-6">
          <Tabs 
            defaultValue="list" 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}
            className="w-[280px]"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-md p-1">
              <TabsTrigger 
                value="list" 
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-200 data-[state=active]:hover:bg-blue-700"
              >
                <List size={16} />
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kanban" 
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-200 data-[state=active]:hover:bg-blue-700"
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add a New Job
        </Button>
      </div>
    </div>
  );
};

export default JobsControlBar;
