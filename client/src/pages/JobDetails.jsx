import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MapPin, Building, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react";

const JobDetails = () => {
    const { id } = useParams();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const isSaved = user?.savedJobs?.some(savedJob => {
        const savedId = (savedJob._id || savedJob).toString();
        return savedId === id.toString();
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) { navigate("/login"); return; }
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('coverLetter', coverLetter);
        try {
            await axios.post(`http://localhost:5000/api/applications/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error applying for job');
        }
    };

    const toggleSave = async () => {
        if (!user) { navigate("/login"); return; }
        if (isSaving) return;
        setIsSaving(true);
        try {
            if (isSaved) {
                const res = await axios.put(`http://localhost:5000/api/auth/unsave-job/${id}`, {}, { withCredentials: true });
                setUser({ ...user, savedJobs: res.data });
            } else {
                const res = await axios.put(`http://localhost:5000/api/auth/save-job/${id}`, {}, { withCredentials: true });
                setUser({ ...user, savedJobs: res.data });
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Specifications</p>
        </div>
    );
    if (!job) return <div className="p-8 text-center text-gray-500 font-bold italic">Role spec missing from registry.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header Hero */}
            <div className="bg-white border-b border-gray-100 py-16">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                Active Job Posting
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    <span>{job.companyName || job.company}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{job.salary || 'Competitive'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{job.type}</span>
                                </div>
                            </div>
                        </div>
                        {user?.role === 'candidate' && !applying && (
                            <div className="flex gap-4">
                                <button
                                    onClick={toggleSave}
                                    className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all border ${isSaved ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {isSaved ? <BookmarkCheck className="w-5 h-5 fill-blue-600" /> : <Bookmark className="w-5 h-5" />}
                                    {isSaved ? 'Saved' : 'Save Job'}
                                </button>
                                <button
                                    onClick={() => setApplying(true)}
                                    className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                                >
                                    Apply Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Job Description */}
                        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Description</h3>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Requirements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {applying ? (
                                <div className="bg-white p-10 rounded-2xl border border-blue-100 shadow-xl shadow-blue-50">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Submit Application</h3>
                                    <form onSubmit={handleApply} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Resume (PDF)</label>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setResume(e.target.files[0])}
                                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cover Letter</label>
                                            <textarea
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[150px]"
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                placeholder="Briefly explain why you're a good fit..."
                                            ></textarea>
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">Submit</button>
                                            <button type="button" onClick={() => setApplying(false)} className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            ) : !user ? (
                                <div className="bg-gray-900 p-10 rounded-2xl text-center text-white shadow-xl">
                                    <p className="text-gray-400 mb-6">Log in to apply for this position.</p>
                                    <button onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">Sign In</button>
                                </div>
                            ) : null}

                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Job Details</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Job Type</span>
                                        <span className="font-bold text-gray-900">{job.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                                        <span className="text-gray-500">Posted on</span>
                                        <span className="font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
