
export type JobStatus = 
  | 'bookmarked'
  | 'applying' 
  | 'applied' 
  | 'interviewing' 
  | 'accepted'
  | 'rejected';

export const JOB_STATUSES: JobStatus[] = [
  'bookmarked',
  'applying',
  'applied',
  'interviewing',
  'accepted',
  'rejected'
];

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  jobUrl?: string;
  status: JobStatus;
  dateSaved: string;
  dateApplied?: string;
  deadline?: string;
  excitement?: number; // 1-5 stars
  notes?: string;
}
