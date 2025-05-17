
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import JobsNavbar from '@/components/DashboardNavbar';
import AddJobDialog from '@/components/jobs/AddJobDialog';
import JobsStatusSummary from '@/components/jobs/JobsStatusSummary';
import JobsControlBar from '@/components/jobs/JobsControlBar';
import JobsContent from '@/components/jobs/JobsContent';
import { JobsProvider, useJobs } from '@/context/jobs/JobsContext';

const JobsPage: React.FC = () => {
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  return (
    <JobsProvider>
      <JobsPageContent 
        isAddJobDialogOpen={isAddJobDialogOpen}
        setIsAddJobDialogOpen={setIsAddJobDialogOpen}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </JobsProvider>
  );
};

interface JobsPageContentProps {
  isAddJobDialogOpen: boolean;
  setIsAddJobDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupBy: string;
  setGroupBy: React.Dispatch<React.SetStateAction<string>>;
  viewMode: 'list' | 'kanban';
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'kanban'>>;
}

const JobsPageContent: React.FC<JobsPageContentProps> = ({
  isAddJobDialogOpen,
  setIsAddJobDialogOpen,
  groupBy,
  setGroupBy,
  viewMode,
  setViewMode
}) => {
  const { addJob, jobs, isLoading } = useJobs();

  return (
    <div className="min-h-screen bg-blue-50">
      <JobsNavbar />
      
      <main className="container mx-auto py-6 px-6 pt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Tracker</h1>
        
        <JobsStatusSummary />

        <JobsControlBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          onOpenAddJobDialog={() => setIsAddJobDialogOpen(true)}
        />

        {/* Empty state */}
        {!isLoading && jobs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No jobs found. Add your first job application!</p>
            <Button 
              onClick={() => setIsAddJobDialogOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add a New Job
            </Button>
          </div>
        )}

        {/* Job Content */}
        {(isLoading || jobs.length > 0) && (
          <JobsContent viewMode={viewMode} />
        )}
      </main>

      <AddJobDialog 
        isOpen={isAddJobDialogOpen} 
        onClose={() => setIsAddJobDialogOpen(false)} 
        onAddJob={addJob}
      />
    </div>
  );
};

export default JobsPage;
