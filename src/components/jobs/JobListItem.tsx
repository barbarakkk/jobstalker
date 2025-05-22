
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Job } from '@/types/job';
import EditJobDialog from './EditJobDialog';
import JobNotesDialog from './JobNotesDialog';

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ 
  job, 
  isSelected, 
  onToggleSelect,
  onUpdate,
  onDelete
}) => {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  // Render stars based on excitement (1-5)
  const renderExcitement = () => {
    if (!job.excitement) return null;
    
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i} 
            size={16} 
            className={i < job.excitement! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const handleNavigateToNotes = () => {
    navigate(`/jobs/${job.id}/notes`);
  };

  return (
    <>
      <div className="grid grid-cols-12 py-3 px-4 border-b items-center text-sm">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(job.id)}
            className="rounded mr-3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="4" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="20" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToNotes}>
                Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(job.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="col-span-3">
          <div className="font-medium text-gray-900">{job.title}</div>
          <div className="text-gray-600">{job.company}</div>
        </div>
        
        <div className="col-span-1 text-gray-700">{job.salary || "N/A"}</div>
        <div className="col-span-2 text-gray-700">{job.location}</div>
        
        <div className="col-span-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            job.status === 'bookmarked' ? 'bg-blue-100 text-blue-800' :
            job.status === 'applying' ? 'bg-orange-100 text-orange-800' :
            job.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
            job.status === 'interviewing' ? 'bg-purple-100 text-purple-800' :
            job.status === 'accepted' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {job.status}
          </span>
        </div>
        
        <div className="col-span-1 text-gray-700">{job.dateSaved || "N/A"}</div>
        <div className="col-span-1 text-gray-700">{job.deadline || "N/A"}</div>
        <div className="col-span-1 text-gray-700">
          {job.dateApplied ? (
            job.dateApplied
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              onClick={() => {
                const updatedJob = {
                  ...job,
                  dateApplied: new Date().toLocaleDateString(),
                  status: 'applied' as const
                };
                onUpdate(updatedJob);
              }}
            >
              Add date
            </Button>
          )}
        </div>
        
        <div className="col-span-1">
          {renderExcitement()}
        </div>

        {/* Notes button/link column */}
        <div className="col-span-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            onClick={handleNavigateToNotes}
          >
            <Edit size={16} />
            <span className="sr-only">View Notes</span>
          </Button>
        </div>
      </div>

      <EditJobDialog 
        job={job} 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        onUpdateJob={onUpdate}
      />
    </>
  );
};

export default JobListItem;
