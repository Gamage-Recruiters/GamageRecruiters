import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, Eye, X, ChevronLeft, ChevronRight, Calendar, Phone, Mail, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for testing purposes - remove in production
const mockInquiries = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+94 77 123 4567",
    subject: "Website Feedback",
    message: "I really like your new website design. The interface is intuitive and the performance is excellent.",
    createdAt: "2025-04-28T14:22:00"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phoneNumber: "+94 77 234 5678",
    subject: "Product Inquiry",
    message: "I'm interested in your services. Could you please provide more information about your pricing plans and available features?",
    createdAt: "2025-04-29T09:15:00"
  },
  {
    id: 3,
    name: "Michael Smith",
    email: "michael@example.com",
    phoneNumber: "+94 77 345 6789",
    subject: "Technical Support",
    message: "I'm having trouble accessing my account. I've tried resetting my password but I'm still unable to log in. Please help.",
    createdAt: "2025-04-30T16:45:00"
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily@example.com",
    phoneNumber: "+94 77 456 7890",
    subject: "Partnership Opportunity",
    message: "Our company is interested in exploring potential partnership opportunities with your organization. Could we schedule a meeting to discuss this further?",
    createdAt: "2025-05-01T11:30:00"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    phoneNumber: "+94 77 567 8901",
    subject: "Feedback on Recent Update",
    message: "The recent update to your platform has significantly improved user experience. However, I noticed a few minor bugs in the notification system that might need attention.",
    createdAt: "2025-05-01T14:20:00"
  },
  {
    id: 6,
    name: "Linda Taylor",
    email: "linda@example.com",
    phoneNumber: "+94 77 678 9012",
    subject: "Custom Solution Request",
    message: "We're looking for a custom solution for our business needs. Your standard offerings are close, but we would need some modifications to fully meet our requirements.",
    createdAt: "2025-05-02T08:10:00"
  }
];

function InquiryManagement() {
  // For development testing - set this to true to use mock data instead of API
  const USE_MOCK_DATA = true;
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Fetch inquiries from backend
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Use mock data for development/testing
          console.log('Using mock data');
          setInquiries(mockInquiries);
          setFilteredInquiries(mockInquiries);
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/contact/getinquiry');
        if (!response.ok) {
          throw new Error(`Failed to fetch inquiries: ${response.status}`);
        }
        
        // Get response text first to check if it's valid JSON
        const responseText = await response.text();
        
        let data;
        try {
          // Try to parse as JSON
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON response:', responseText.substring(0, 100) + '...');
          throw new Error('Server returned invalid JSON response');
        }
        
        // Check if results property exists
        if (!data || !data.results) {
          console.error('Unexpected response format:', data);
          throw new Error('Unexpected API response format');
        }
        
        setInquiries(data.results);
        setFilteredInquiries(data.results);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [USE_MOCK_DATA]);

  // Filter inquiries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInquiries(inquiries);
    } else {
      const filtered = inquiries.filter(
        inquiry =>
          inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInquiries(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, inquiries]);

  // Delete inquiry
  const deleteInquiry = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        // Mock delete for development/testing
        console.log('Mock deleting inquiry:', id);
        
        // Remove from state
        setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
        setFilteredInquiries(filteredInquiries.filter(inquiry => inquiry.id !== id));
        
        // Close modal if the deleted inquiry was being viewed
        if (selectedInquiry && selectedInquiry.id === id) {
          setIsModalOpen(false);
        }
        
        // Show success message
        alert('Inquiry deleted successfully (mock)');
        return;
      }
      
      const response = await fetch(`/api/contact/deleteinquiry/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete inquiry: ${response.status}`);
      }
      
      // Try to parse the response if available
      let responseData;
      try {
        const responseText = await response.text();
        if (responseText) {
          responseData = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.warn('Could not parse delete response as JSON:', jsonError);
      }
      
      // Remove from state
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      setFilteredInquiries(filteredInquiries.filter(inquiry => inquiry.id !== id));
      
      // Close modal if the deleted inquiry was being viewed
      if (selectedInquiry && selectedInquiry.id === id) {
        setIsModalOpen(false);
      }
      
      // Show success message
      alert(responseData?.message || 'Inquiry deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Download as PDF
  const downloadPDF = (inquiry) => {
    try {
      // In a real implementation, you'd generate a PDF on the server
      // or use a library like jsPDF to generate it client-side
      console.log('Downloading PDF for inquiry:', inquiry.id);
      
      // Example of how you might implement this with an API endpoint
      if (!USE_MOCK_DATA) {
        // This would be implemented on your backend
        // window.open(`/api/contact/downloadpdf/${inquiry.id}`, '_blank');
      }
      
      alert(`Downloading PDF for inquiry from ${inquiry.name}`);
    } catch (err) {
      console.error('PDF download error:', err);
      alert(`Error downloading PDF: ${err.message}`);
    }
  };

  // View inquiry details
  const viewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  // Helper to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modal for detailed view
  const DetailModal = ({ inquiry, onClose }) => {
    if (!inquiry) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center border-b border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white">Inquiry Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-700">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-3 bg-indigo-900 rounded-full mr-4">
                  <User className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{inquiry.name}</h4>
                  <p className="text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {inquiry.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(inquiry.createdAt)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm uppercase text-gray-500 mb-1">Subject</h5>
                <p className="text-white font-medium">{inquiry.subject}</p>
              </div>
              
              <div>
                <h5 className="text-sm uppercase text-gray-500 mb-1">Phone Number</h5>
                <p className="text-white flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {inquiry.phoneNumber}
                </p>
              </div>
              
              <div>
                <h5 className="text-sm uppercase text-gray-500 mb-1">Message</h5>
                <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
                  <p>{inquiry.message}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 border-t border-gray-700 p-6">
            <button
              onClick={() => deleteInquiry(inquiry.id)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
            <button
              onClick={() => downloadPDF(inquiry)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-red-900 text-white px-6 py-4 rounded-lg shadow-lg">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-gray-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Inquiry Management
          </h1>
          <div className="bg-gray-800 text-gray-300 rounded-full px-4 py-1 text-sm">
            {filteredInquiries.length} Inquiries
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((inquiry, index) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white truncate">{inquiry.name}</h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <p className="text-sm text-gray-300 font-medium truncate">{inquiry.subject}</p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {inquiry.email}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {inquiry.phoneNumber}
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-3 mb-4 h-16 overflow-hidden">
                        <p className="text-xs text-gray-400 line-clamp-3">{inquiry.message}</p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewInquiry(inquiry)}
                          className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadPDF(inquiry)}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                          <Download className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center py-12">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-300">No inquiries found</h3>
                    <p className="text-gray-500 mt-2">
                      {searchTerm ? "Try different search terms" : "You don't have any inquiries yet"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="border-t border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInquiries.length)} of {filteredInquiries.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Logic to determine which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isModalOpen && (
          <DetailModal
            inquiry={selectedInquiry}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default InquiryManagement;