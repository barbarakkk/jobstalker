
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import JobsNavbar from '@/components/DashboardNavbar';
import AddJobDialog from '@/components/jobs/AddJobDialog';
import JobsStatusSummary from '@/components/jobs/JobsStatusSummary';
import JobsControlBar from '@/components/jobs/JobsControlBar';
import JobsContent from '@/components/jobs/JobsContent';
import { useJobs } from '@/context/jobs/JobsContext';
import { Plus, Briefcase } from 'lucide-react';

const JobsPage: React.FC = () => {
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const { addJob, jobs, isLoading } = useJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <JobsNavbar />
      
      <main className="container mx-auto py-8 px-6 pt-24 space-y-8">
        <JobsStatusSummary />

        <JobsControlBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenAddJobDialog={() => setIsAddJobDialogOpen(true)}
        />

        {/* Empty state */}
        {!isLoading && jobs.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No job applications yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start tracking your job applications and take control of your career journey.</p>
            <Button 
              onClick={() => setIsAddJobDialogOpen(true)} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Add Your First Job
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
