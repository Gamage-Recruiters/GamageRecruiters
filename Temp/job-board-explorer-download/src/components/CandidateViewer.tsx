
import React, { useState } from 'react';
import { Job, Candidate } from '../types/jobTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../utils/dateUtils';
import { Download, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { downloadCV } from '../services/jobService';

interface CandidateViewerProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

const CandidateViewer: React.FC<CandidateViewerProps> = ({ isOpen, onClose, job }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCandidates = job.candidates.length;
  const currentCandidate = job.candidates[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCandidates);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCandidates) % totalCandidates);
  };

  const handleDownload = () => {
    downloadCV(currentCandidate.id);
    toast({
      title: "Download Started",
      description: `CV for ${currentCandidate.name} will be downloaded.`,
    });
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'Hired':
        return 'bg-teal-100 text-teal-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Candidates for {job.title} ({currentIndex + 1}/{totalCandidates})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto p-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{currentCandidate.name}</CardTitle>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentCandidate.status)}`}>
                {currentCandidate.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{currentCandidate.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{currentCandidate.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Applied</p>
                  <p className="text-sm">{formatDate(currentCandidate.appliedDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-sm">{currentCandidate.experience}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">Resume available</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={totalCandidates <= 1}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            variant="default"
            onClick={handleNext}
            disabled={totalCandidates <= 1}
            className="bg-brand-blue hover:bg-blue-700"
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateViewer;
