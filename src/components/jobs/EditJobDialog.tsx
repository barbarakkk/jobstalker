
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import { useForm } from 'react-hook-form';

interface EditJobDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (job: Job) => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatus;
  dateApplied?: string;
  deadline?: string;
  jobUrl?: string;
  notes?: string;
  excitement?: number;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({ 
  job, 
  isOpen, 
  onClose, 
  onUpdateJob 
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<JobFormData>({
    defaultValues: {
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      status: job.status,
      dateApplied: job.dateApplied,
      deadline: job.deadline,
      jobUrl: job.jobUrl,
      notes: job.notes,
      excitement: job.excitement
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        status: job.status,
        dateApplied: job.dateApplied,
        deadline: job.deadline,
        jobUrl: job.jobUrl,
        notes: job.notes,
        excitement: job.excitement
      });
    }
  }, [isOpen, job, reset]);

  const onSubmit = (data: JobFormData) => {
    const updatedJob: Job = {
      ...job,
      ...data,
    };
    
    onUpdateJob(updatedJob);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title" 
                {...register('title', { required: 'Title is required' })} 
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input 
                id="company" 
                {...register('company', { required: 'Company is required' })}
              />
              {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary" 
                {...register('salary')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register('status', { required: 'Status is required' })}
              >
                {JOB_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excitement">Excitement</Label>
              <select
                id="excitement"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register('excitement', { valueAsNumber: true })}
              >
                <option value="">Select rating</option>
                <option value="1">1 star</option>
                <option value="2">2 stars</option>
                <option value="3">3 stars</option>
                <option value="4">4 stars</option>
                <option value="5">5 stars</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied</Label>
              <Input 
                id="dateApplied" 
                type="date"
                {...register('dateApplied')} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input 
                id="deadline" 
                type="date"
                {...register('deadline')} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input 
              id="jobUrl" 
              {...register('jobUrl')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              {...register('notes')}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
