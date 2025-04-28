export const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'client',
    status: 'active',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2024-02-01',
  },
];

export const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'full-time',
    status: 'open',
    postedDate: '2024-03-01',
    applications: 12,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'New York',
    type: 'full-time',
    status: 'open',
    postedDate: '2024-02-28',
    applications: 8,
  },
];

export const mockWorkshops = [
  {
    id: '1',
    title: 'Resume Writing Masterclass',
    date: '2024-03-15',
    capacity: 50,
    registered: 35,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Interview Skills Workshop',
    date: '2024-03-20',
    capacity: 30,
    registered: 30,
    status: 'upcoming',
  },
];

export const mockApplications = [
  {
    id: '1',
    jobId: '1',
    applicantName: 'Michael Brown',
    email: 'michael@example.com',
    status: 'pending',
    appliedDate: '2024-03-05',
    resumeUrl: '/resumes/michael-brown.pdf',
  },
  {
    id: '2',
    jobId: '1',
    applicantName: 'Emma Wilson',
    email: 'emma@example.com',
    status: 'shortlisted',
    appliedDate: '2024-03-04',
    resumeUrl: '/resumes/emma-wilson.pdf',
  },
];

export const mockBlogPosts = [
  {
    id: '1',
    title: 'Top 10 Interview Tips for 2024',
    excerpt: 'Master your next job interview with these essential tips...',
    content: 'Full content here...',
    author: 'Sarah Johnson',
    publishDate: '2024-03-01',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'The Future of Remote Work',
    excerpt: 'How companies are adapting to the new normal...',
    content: 'Full content here...',
    author: 'John Smith',
    publishDate: '2024-02-28',
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export const mockPartners = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    website: 'https://techcorp.com',
    description: 'Leading technology solutions provider',
    partnershipDate: '2024-01-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Global Innovations',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    website: 'https://globalinnovations.com',
    description: 'Innovation consulting and recruitment',
    partnershipDate: '2024-02-01',
    status: 'active',
  },
];