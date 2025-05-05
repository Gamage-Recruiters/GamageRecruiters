
import { Job, Candidate } from "../types/jobTypes";

// Mock data for job listings
export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    postedDate: "2025-03-15",
    applicationsCount: 12,
    status: "Open",
    candidates: [
      {
        id: "c-101",
        name: "Alex Johnson",
        email: "alex@example.com",
        phone: "+1 555-123-4567",
        appliedDate: "2025-03-20",
        experience: "5 years",
        status: "Shortlisted",
        resumeUrl: "/resumes/alex-resume.pdf"
      },
      {
        id: "c-102",
        name: "Jamie Smith",
        email: "jamie@example.com",
        phone: "+1 555-234-5678",
        appliedDate: "2025-03-21",
        experience: "3 years",
        status: "Under Review",
        resumeUrl: "/resumes/jamie-resume.pdf"
      },
      {
        id: "c-103",
        name: "Taylor Wilson",
        email: "taylor@example.com",
        phone: "+1 555-345-6789",
        appliedDate: "2025-03-22",
        experience: "7 years",
        status: "Shortlisted",
        resumeUrl: "/resumes/taylor-resume.pdf"
      }
    ]
  },
  {
    id: "job-2",
    title: "UX Designer",
    department: "Design",
    location: "New York",
    postedDate: "2025-03-18",
    applicationsCount: 8,
    status: "Open",
    candidates: [
      {
        id: "c-104",
        name: "Morgan Lee",
        email: "morgan@example.com",
        phone: "+1 555-456-7890",
        appliedDate: "2025-03-19",
        experience: "4 years",
        status: "Under Review",
        resumeUrl: "/resumes/morgan-resume.pdf"
      },
      {
        id: "c-105",
        name: "Casey Brown",
        email: "casey@example.com",
        phone: "+1 555-567-8901",
        appliedDate: "2025-03-20",
        experience: "2 years",
        status: "New",
        resumeUrl: "/resumes/casey-resume.pdf"
      }
    ]
  },
  {
    id: "job-3",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco",
    postedDate: "2025-03-10",
    applicationsCount: 15,
    status: "Closed",
    candidates: [
      {
        id: "c-106",
        name: "Jordan Rivera",
        email: "jordan@example.com",
        phone: "+1 555-678-9012",
        appliedDate: "2025-03-12",
        experience: "6 years",
        status: "Hired",
        resumeUrl: "/resumes/jordan-resume.pdf"
      },
      {
        id: "c-107",
        name: "Riley Cooper",
        email: "riley@example.com",
        phone: "+1 555-789-0123",
        appliedDate: "2025-03-13",
        experience: "8 years",
        status: "Rejected",
        resumeUrl: "/resumes/riley-resume.pdf"
      },
      {
        id: "c-108",
        name: "Avery Martinez",
        email: "avery@example.com",
        phone: "+1 555-890-1234",
        appliedDate: "2025-03-14",
        experience: "5 years",
        status: "Interviewed",
        resumeUrl: "/resumes/avery-resume.pdf"
      }
    ]
  },
  {
    id: "job-4",
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    postedDate: "2025-03-20",
    applicationsCount: 10,
    status: "Open",
    candidates: [
      {
        id: "c-109",
        name: "Quinn Thompson",
        email: "quinn@example.com",
        phone: "+1 555-901-2345",
        appliedDate: "2025-03-21",
        experience: "4 years",
        status: "New",
        resumeUrl: "/resumes/quinn-resume.pdf"
      },
      {
        id: "c-110",
        name: "Reese Garcia",
        email: "reese@example.com",
        phone: "+1 555-012-3456",
        appliedDate: "2025-03-22",
        experience: "6 years",
        status: "Shortlisted",
        resumeUrl: "/resumes/reese-resume.pdf"
      }
    ]
  }
];

// Get all jobs
export const getAllJobs = (): Job[] => {
  return jobs;
};

// Get a specific job by ID
export const getJobById = (jobId: string): Job | undefined => {
  return jobs.find(job => job.id === jobId);
};

// Get all candidates for a job
export const getCandidatesByJobId = (jobId: string): Candidate[] => {
  const job = jobs.find(job => job.id === jobId);
  return job ? job.candidates : [];
};

// Get a specific candidate by ID
export const getCandidateById = (candidateId: string): Candidate | undefined => {
  for (const job of jobs) {
    const candidate = job.candidates.find(candidate => candidate.id === candidateId);
    if (candidate) {
      return candidate;
    }
  }
  return undefined;
};

// Simulate downloading all CVs for a job
export const downloadAllCVs = (jobId: string): boolean => {
  console.log(`Downloading all CVs for job ${jobId}`);
  // In a real app, this would trigger a download of all CVs
  // For now we'll just return true to simulate success
  return true;
};

// Simulate downloading a single CV
export const downloadCV = (candidateId: string): boolean => {
  console.log(`Downloading CV for candidate ${candidateId}`);
  // In a real app, this would trigger a download of the CV
  // For now we'll just return true to simulate success
  return true;
};
