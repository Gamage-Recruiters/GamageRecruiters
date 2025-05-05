
import React, { useState } from 'react';
import { Job } from '../types/jobTypes';
import { downloadAllCVs } from '../services/jobService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '../utils/dateUtils';
import { toast } from '@/components/ui/use-toast';
import { Download, Eye } from 'lucide-react';
import CandidateViewer from './CandidateViewer';

interface JobsTableProps {
  jobs: Job[];
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDownload = (job: Job) => {
    // In a real application, this would trigger an actual download
    downloadAllCVs(job.id);
    toast({
      title: "Download Started",
      description: `${job.candidates.length} CVs will be downloaded from ${job.title}`,
    });
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{formatDate(job.postedDate)}</TableCell>
                <TableCell>{job.applicationsCount}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Open'
                        ? 'bg-green-100 text-green-800'
                        : job.status === 'Closed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(job)}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleView(job)}
                      className="flex items-center bg-brand-blue hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedJob && (
        <CandidateViewer
          isOpen={isViewerOpen}
          onClose={closeViewer}
          job={selectedJob}
        />
      )}
    </>
  );
};

export default JobsTable;
