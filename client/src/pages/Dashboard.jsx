import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?.role === 'recruiter' || user?.role === 'admin') {
                    const [jobsRes, appsRes] = await Promise.all([
                        axios.get("http://localhost:5000/api/jobs", { withCredentials: true }),
                        axios.get("http://localhost:5000/api/applications/all", { withCredentials: true })
                    ]);
                    setJobs(jobsRes.data);
                    setAllApplications(appsRes.data);
                } else {
                    const res = await axios.get("http://localhost:5000/api/applications/me", { withCredentials: true });
                    setJobs(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    const stats = {
        total: jobs.length,
        open: jobs.filter(j => j.status === 'Open').length,
        pending: user?.role === 'recruiter'
            ? allApplications.filter(a => a.status === 'Applied' || a.status === 'Screening').length
            : jobs.filter(a => a.status === 'Applied' || a.status === 'Screening').length,
        interview: user?.role === 'recruiter'
            ? allApplications.filter(a => a.status === 'Interview').length
            : jobs.filter(a => a.status === 'Interview').length,
        offered: user?.role === 'recruiter'
            ? allApplications.filter(a => a.status === 'Offer' || a.status === 'Accepted').length
            : jobs.filter(a => a.status === 'Offer' || a.status === 'Accepted').length,
        rejected: user?.role === 'recruiter'
            ? allApplications.filter(a => a.status === 'Rejected').length
            : jobs.filter(a => a.status === 'Rejected').length
    };

    const conversionRate = stats.total > 0 ? Math.round(((stats.offered) / stats.total) * 100) : 0;

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await axios.delete(`http://localhost:5000/api/jobs/${id}`, { withCredentials: true });
                setJobs(jobs.filter(job => job._id !== id));
            } catch (error) {
                console.error(error);
                alert("Failed to delete job");
            }
        }
    }


    const StatusTimeline = ({ currentStatus }) => {
        const statuses = ['Applied', 'Screening', 'Interview', 'Offer'];
        const isRejected = currentStatus === 'Rejected';
        const currentIndex = statuses.indexOf(currentStatus);

        return (
            <div className="flex items-center gap-2 mt-2">
                {statuses.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCompleted = index < currentIndex;
                    return (
                        <div key={step} className="flex items-center gap-2">
                            <div className="flex flex-col items-center group relative">
                                <div className={`w-3 h-3 rounded-full transition-all duration-500 shadow-sm
                                    ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-200'}
                                    ${isRejected && index === currentIndex ? 'bg-rose-500 animate-pulse' : ''}
                                `} />
                                <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-0.5 rounded pointer-events-none whitespace-nowrap`}>
                                    {step}
                                </span>
                            </div>
                            {index < statuses.length - 1 && (
                                <div className={`w-8 h-0.5 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                            )}
                        </div>
                    );
                })}
                {isRejected && (
                    <div className="flex items-center gap-2 ml-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">Position Closed</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user?.role === 'recruiter' ? 'Recruiter Dashboard' : 'My Applications'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {user?.role === 'recruiter' ? 'Manage your active job postings and candidates' : 'Track your professional applications'}
                        </p>
                    </div>
                    {user?.role === 'recruiter' && (
                        <Link to="/create-job" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold text-sm">
                            + Post New Job
                        </Link>
                    )}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            {user?.role === 'recruiter' ? 'Active Jobs' : 'Total Applied'}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    {user?.role === 'recruiter' ? (
                        <>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Offers Extended</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.offered}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Success Rate</p>
                                <p className="text-3xl font-bold text-blue-600">{conversionRate}%</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rejections</p>
                                <p className="text-3xl font-bold text-rose-600">{stats.rejected}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">In Interview</p>
                                <p className="text-3xl font-bold text-indigo-600">{stats.interview}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Offers Received</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.offered}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Under Review</p>
                                <p className="text-3xl font-bold text-blue-600">{jobs.filter(a => a.status === 'Screening').length}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Alerts Section for Candidates */}
                {user?.role === 'candidate' && jobs.filter(a => a.status === 'Interview' || a.status === 'Offer').length > 0 && (
                    <div className="mb-10 space-y-4">
                        {jobs.filter(a => a.status === 'Interview' || a.status === 'Offer').map(app => (
                            <div key={app._id} className="bg-white border-l-4 border-blue-600 p-6 rounded-r-2xl shadow-md flex justify-between items-center">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2
                                        ${app.status === 'Offer' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}
                                    `}>
                                        {app.status === 'Offer' ? 'Action Required: Offer Ready' : 'Upcoming Interview'}
                                    </span>
                                    <h3 className="text-xl font-bold">{app.job?.title} at {app.job?.company}</h3>
                                    {app.status === 'Interview' && (
                                        <p className="text-sm text-gray-500 mt-1">Scheduled for: {new Date(app.interviewDate).toLocaleString()}</p>
                                    )}
                                </div>
                                <Link
                                    to={app.status === 'Offer' ? `/offer/${app._id}` : `/jobs/${app.job?._id}`}
                                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all
                                        ${app.status === 'Offer' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    `}
                                >
                                    {app.status === 'Offer' ? 'Review Offer' : 'View Details'}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* List Section */}
                <div className="space-y-12">
                    {user?.role === 'recruiter' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map(job => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isRecruiter={user._id === job.postedBy?._id || user._id === job.postedBy}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Application Pipeline Section */}
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic flex items-center gap-3 mb-8">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    Application Pipeline
                                </h2>
                                <div className="space-y-8">
                                    {jobs.map(app => (
                                        <div key={app._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-lg font-black text-white italic shadow-lg shadow-blue-50">
                                                        {app.job?.company?.charAt(0) || 'J'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{app.job?.title}</h3>
                                                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                                            <span className="text-blue-600">@</span> {app.job?.company} • {app.job?.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 flex justify-center lg:justify-start">
                                                    <StatusTimeline currentStatus={app.status} />
                                                </div>

                                                <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0">
                                                    <div className="text-right">
                                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border
                                                            ${app.status === 'Applied' ? 'bg-gray-50 text-gray-500 border-gray-100' : ''}
                                                            ${app.status === 'Screening' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                                                            ${app.status === 'Interview' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                                                            ${app.status === 'Offer' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                                                            ${app.status === 'Accepted' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-100' : ''}
                                                            ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : ''}
                                                        `}>
                                                            {app.status}
                                                        </span>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <Link to={`/jobs/${app.job?._id}`} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group/btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {jobs.length === 0 && (
                                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No active applications</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Saved Jobs Section */}
                            <div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic flex items-center gap-3 mb-8">
                                    <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                    Saved Opportunities
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {user?.savedJobs?.filter(j => j).map((job) => (
                                        <JobCard key={job._id || job} job={job} />
                                    ))}
                                    {(user?.savedJobs?.length === 0 || !user?.savedJobs) && (
                                        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No saved positions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
