
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  experience: string;
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Interviewed' | 'Hired' | 'Rejected';
  resumeUrl: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  postedDate: string;
  applicationsCount: number;
  status: 'Open' | 'Closed' | 'Draft';
  candidates: Candidate[];
}
