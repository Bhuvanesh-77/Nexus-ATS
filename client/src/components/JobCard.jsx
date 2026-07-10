import { Link } from "react-router-dom";
import { Briefcase, MapPin, Building, DollarSign, Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useState } from "react";

const JobCard = ({ job, isRecruiter, onDelete }) => {
    const { user, setUser } = useAuth();

    // jobId is robust to both populated objects and raw ID strings
    const jobId = (job?._id || (typeof job === 'string' ? job : null))?.toString();

    // isSaved check is defensive against nulls and handles both ID strings and populated objects
    const isSaved = user?.savedJobs?.some(savedJob => {
        if (!savedJob) return false;
        const savedId = (savedJob._id || savedJob).toString();
        return savedId === jobId;
    });

    const [processing, setProcessing] = useState(false);

    // If job data is missing (e.g. broken reference in DB), don't render
    if (!job || (typeof job === 'object' && !job.title)) return null;

    const toggleSave = async (e) => {
        if (processing) return;
        if (!user || !setUser) {
            console.warn("User state or setter missing");
            return;
        }
        setProcessing(true);
        e.preventDefault();
        e.stopPropagation();
        try {
            if (isSaved) {
                const res = await axios.put(`http://localhost:5000/api/auth/unsave-job/${jobId}`, {}, { withCredentials: true });
                if (setUser) setUser({ ...user, savedJobs: res.data });
            } else {
                const res = await axios.put(`http://localhost:5000/api/auth/save-job/${jobId}`, {}, { withCredentials: true });
                if (setUser) setUser({ ...user, savedJobs: res.data });
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
            {!isRecruiter && user?.role === 'candidate' && (
                <button
                    onClick={toggleSave}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all z-10"
                >
                    {isSaved ? <BookmarkCheck className="h-5 w-5 text-blue-600 fill-blue-600" /> : <Bookmark className="h-5 w-5" />}
                </button>
            )}
            <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <Briefcase className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                {isRecruiter && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/edit-job/${jobId}`} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200" title="Edit Job">
                            <span className="text-xs font-bold">Edit</span>
                        </Link>
                        <button onClick={() => onDelete(jobId)} className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100" title="Delete Job">
                            <span className="text-xs font-bold font-white">Del</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{job.title}</h3>
                <div className="flex items-center text-gray-500 font-medium mb-6">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{job.company}</span>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-3 text-blue-500" />
                        {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-3 text-emerald-500" />
                        {job.salary || "Competitive"}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <Link to={`/jobs/${jobId}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    View Details →
                </Link>
                {isRecruiter && (
                    <Link to={`/applications/${jobId}`} className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                        View Applicants
                    </Link>
                )}
            </div>
        </div>
    );
};

export default JobCard;
