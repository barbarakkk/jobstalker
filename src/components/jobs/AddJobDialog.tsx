
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JOB_STATUSES, type Job, type JobStatus } from '@/types/job';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

interface AddJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  status: JobStatus;
  deadline?: string;
  jobUrl?: string;
  notes?: string;
  excitement?: number;
}

const AddJobDialog: React.FC<AddJobDialogProps> = ({ isOpen, onClose, onAddJob }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<JobFormData>();

  const onSubmit = (data: JobFormData) => {
    const newJob: Job = {
      id: crypto.randomUUID(), // This will be replaced by the database-generated ID
      title: data.title,
      company: data.company,
      location: data.location,
      salary: data.salary,
      status: data.status,
      dateSaved: new Date().toLocaleDateString(),
      deadline: data.deadline,
      jobUrl: data.jobUrl,
      notes: data.notes,
      excitement: data.excitement || 0
    };
    
    onAddJob(newJob);
    reset();
  };

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input 
                id="title" 
                {...register('title', { required: 'Title is required' })} 
                placeholder="Software Engineer"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input 
                id="company" 
                {...register('company', { required: 'Company is required' })}
                placeholder="ACME Corp" 
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
                placeholder="New York, NY" 
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary" 
                {...register('salary')}
                placeholder="$100,000" 
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
                defaultValue="bookmarked"
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
              placeholder="https://example.com/job" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Add any notes about this job..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excitement">Excitement Level</Label>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;
