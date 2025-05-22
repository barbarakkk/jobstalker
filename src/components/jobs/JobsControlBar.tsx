
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban } from 'lucide-react';
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
        
        {/* Only show Kanban button */}
        <div className="ml-4 md:ml-6">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setViewMode('kanban')}
          >
            <Kanban size={16} />
            <span>Kanban</span>
          </Button>
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
