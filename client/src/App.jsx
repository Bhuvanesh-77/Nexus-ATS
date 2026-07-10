import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import JobApplications from "./pages/JobApplications";
import OfferLetter from "./pages/OfferLetter";
import AdminDashboard from "./pages/AdminDashboard";
import Jobs from "./pages/Jobs";
import CandidatePool from "./pages/CandidatePool";
import CandidateProfile from "./pages/CandidateProfile";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/applications/:jobId" element={<JobApplications />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/offer/:id" element={<OfferLetter />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidate-pool" element={<CandidatePool />} />
              <Route path="/candidate/:id" element={<CandidateProfile />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
