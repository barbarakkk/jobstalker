
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban } from 'lucide-react';
import { useJobs } from '@/context/jobs/JobsContext';

interface JobsControlBarProps {
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
  groupBy: string;
  setGroupBy: (value: string) => void;
  onOpenAddJobDialog: () => void;
}

const JobsControlBar: React.FC<JobsControlBarProps> = ({ 
  viewMode, 
  setViewMode, 
  groupBy, 
  setGroupBy, 
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
        
        {/* View Toggle */}
        <div className="ml-4 md:ml-6">
          <Tabs 
            defaultValue="list" 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}
            className="w-[240px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Kanban size={16} />
                <span>Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        {viewMode === 'list' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="rounded border p-1 text-sm"
            >
              <option value="none">None</option>
              <option value="company">Company</option>
              <option value="location">Location</option>
            </select>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          Columns
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          Menu
        </Button>
        
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
