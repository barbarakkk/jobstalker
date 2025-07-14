
import { Job, JobStatus } from '@/types/job';

export type JobsContextType = {
  jobs: Job[];
  isLoading: boolean;
  selectedJobIds: Set<string>;
  setSelectedJobIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleToggleSelect: (jobId: string) => void;
  handleSelectAll: (select: boolean) => void;
  addJob: (job: Job) => Promise<void>;
  updateJob: (updatedJob: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
};
