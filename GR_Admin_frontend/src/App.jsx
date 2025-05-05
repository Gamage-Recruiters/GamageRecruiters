import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientUsers from './pages/ClientUsers';
import AdminUsers from './pages/AdminUsers';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Workshops from './pages/Workshops';
import Blog from './pages/BlogManagement';
import Partners from './pages/Partners';
import ClientDetailsPage from './pages/Client/ClientView';
import ViewAllJobs from './components/Jobs/ViewAllJobs';
import AddJob from './components/Jobs/AddJob';
import EditJob from './components/Jobs/EditJob';
import CandidateDetailsView from './components/Jobs/CandidateDetailsView';
import AddNewBlog from './pages/Blog/AddNewBlog';
import EditBlog from './pages/Blog/EditBlog';
import AddAdmin from './pages/Admin/AddAdmin';
import EditAdmin from './pages/Admin/EditAdmin';
import AddWorkshop from './pages/Workshop/AddWorkshop';
import UpdateWorkshop from './pages/Workshop/UpdateWorkshop';
import InquiryManagement from './pages/InquiryManagement';
import ApplicationDetailView from './pages/ApplicationDetailView';
import JobApplicationsView from './pages/JobApplicationsView';
import JobDashboard from './components/JobDashboard';
import ViewClient from './components/ViewClient';



function App() {
  // TODO: Implement actual auth logic
  const isAuthenticated = true;

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientUsers />} />
              <Route path="/admin/client/view/:userId" element={<ViewClient />} />
              <Route path="/admins" element={<AdminUsers />} />
              <Route path="/jobs" element={<ViewAllJobs />} />
              <Route path="/jobss" element={<Jobs />} />
              <Route path="/jobs/add" element={<AddJob/>} />
              <Route path="/jobs/edit/:jobid" element={<EditJob />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/candidate" element={<CandidateDetailsView />} />
              <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
              <Route path="/blog/add" element={<AddNewBlog />} />
              <Route path="/blog/edit/:blogId" element={<EditBlog />} />
              <Route path="/admins/add" element={<AddAdmin />} />
              <Route path="/admins/edit/:adminId" element={<EditAdmin />} />
              <Route path="/workshops/add"  element={<AddWorkshop />} />
              <Route path="/workshops/edit/:id"  element={<UpdateWorkshop />} />
              <Route path="/inquiries" element={<InquiryManagement />} />
              <Route path="/applications/:applicationId" element={<ApplicationDetailView />} />
              <Route path="/jobs/:jobId/applications" element={<JobApplicationsView />} />
              <Route path="/applications" element={<JobApplicationsView />} />
              <Route path="/job-dashboard" element={<JobDashboard />} />

            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;