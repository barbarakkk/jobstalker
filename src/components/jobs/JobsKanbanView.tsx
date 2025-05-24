
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
      <div className="grid grid-cols-6 gap-4 h-[70vh]">
        {columns.map(column => {
          const columnJobs = jobs.filter(job => job.status === column.id);
          
          return (
            <div 
              key={column.id}
              className={`flex flex-col rounded-xl ${column.color} border-2 shadow-lg hover:shadow-xl transition-all duration-200`}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
            >
              <div className="p-3 border-b-2 border-white/50 font-semibold flex justify-between items-center bg-white/40 rounded-t-xl">
                <span className="text-gray-800 text-sm font-bold truncate">{column.title}</span>
                <span className="bg-white text-gray-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0">
                  {columnJobs.length}
                </span>
              </div>
              
              <div className="p-2 flex-grow overflow-y-auto space-y-2">
                {columnJobs.map(job => (
                  <Card 
                    key={job.id}
                    className="cursor-pointer bg-white border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1" 
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                  >
                    <CardContent className="p-3">
                      <div className="font-semibold text-gray-900 truncate mb-1 text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600 mb-2 font-medium truncate">{job.company}</div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <div className="truncate max-w-[80px] bg-gray-100 px-1 py-0.5 rounded text-xs">{job.location}</div>
                        {renderExcitement(job.excitement)}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-gray-600 bg-gray-50 px-1 py-0.5 rounded text-xs truncate max-w-[100px]">
                          {job.deadline ? `Due: ${job.deadline}` : "No deadline"}
                        </div>
                        
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => openNotesDialog(job)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors duration-200"
                          >
                            <FileText size={14} />
                          </button>
                          <button 
                            onClick={() => onDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors duration-200 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-xs italic bg-white/30 rounded-lg border-2 border-dashed border-gray-300">
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
