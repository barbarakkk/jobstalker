
import React, { useState } from 'react';
import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JobNotesDialog from './JobNotesDialog';

interface JobsKanbanViewProps {
  jobs: Job[];
  onUpdateJob: (updatedJob: Job) => Promise<void>;
  onDeleteJob: (jobId: string) => Promise<void>;
}

const JobsKanbanView: React.FC<JobsKanbanViewProps> = ({ jobs, onUpdateJob, onDeleteJob }) => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const columns = [
    { id: 'bookmarked', title: 'BOOKMARKED', color: 'border-blue-400 bg-blue-50/80 shadow-blue-100' },
    { id: 'applying', title: 'APPLYING', color: 'border-orange-400 bg-orange-50/80 shadow-orange-100' },
    { id: 'applied', title: 'APPLIED', color: 'border-yellow-400 bg-yellow-50/80 shadow-yellow-100' },
    { id: 'interviewing', title: 'INTERVIEWING', color: 'border-purple-400 bg-purple-50/80 shadow-purple-100' },
    { id: 'accepted', title: 'ACCEPTED', color: 'border-green-400 bg-green-50/80 shadow-green-100' },
    { id: 'rejected', title: 'REJECTED', color: 'border-red-400 bg-red-50/80 shadow-red-100' }
  ];

  // Render excitement stars
  const renderExcitement = (excitement?: number) => {
    if (!excitement) return null;
    
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i} 
            size={14}
            className={i < excitement ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  // Handle job card drag
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, job: Job) => {
    e.dataTransfer.setData('jobId', job.id);
  };

  // Handle drop on column
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    const job = jobs.find(j => j.id === jobId);
    
    if (job && job.status !== status) {
      const updatedJob = {
        ...job,
        status: status as any
      };
      
      onUpdateJob(updatedJob);
      
      toast({
        title: "Job status updated",
        description: `${job.title} moved to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openNotesDialog = (job: Job) => {
    setSelectedJob(job);
    setIsNotesDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-nowrap gap-6 overflow-x-auto pb-6 pt-2" style={{ minHeight: '70vh' }}>
        {columns.map(column => {
          const columnJobs = jobs.filter(job => job.status === column.id);
          
          return (
            <div 
              key={column.id}
              className={`flex-shrink-0 w-80 flex flex-col rounded-xl ${column.color} border-2 shadow-lg hover:shadow-xl transition-all duration-200`}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
            >
              <div className="p-4 border-b-2 border-white/50 font-semibold flex justify-between items-center bg-white/40 rounded-t-xl">
                <span className="text-gray-800">{column.title}</span>
                <span className="bg-white text-gray-700 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {columnJobs.length}
                </span>
              </div>
              
              <div className="p-3 flex-grow overflow-y-auto space-y-3">
                {columnJobs.map(job => (
                  <Card 
                    key={job.id}
                    className="cursor-pointer bg-white border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1" 
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                  >
                    <CardContent className="p-4">
                      <div className="font-semibold text-gray-900 truncate mb-1">{job.title}</div>
                      <div className="text-sm text-gray-600 mb-3 font-medium">{job.company}</div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <div className="truncate max-w-[120px] bg-gray-100 px-2 py-1 rounded-md">{job.location}</div>
                        {renderExcitement(job.excitement)}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          {job.deadline ? `Due: ${job.deadline}` : "No deadline"}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openNotesDialog(job)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded-md transition-colors duration-200"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded-md transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnJobs.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm italic bg-white/30 rounded-lg border-2 border-dashed border-gray-300">
                    No jobs in this status
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <JobNotesDialog
          job={selectedJob}
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          onUpdateJob={onUpdateJob}
          onDeleteJob={onDeleteJob}
        />
      )}
    </>
  );
};

export default JobsKanbanView;
