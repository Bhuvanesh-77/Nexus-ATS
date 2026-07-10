import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Briefcase, FileText, ChevronLeft, Calendar, MapPin, TrendingUp, Target, PieChart, Info, DollarSign, Clock } from "lucide-react";

const CandidateProfile = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/applications/candidate/${id}`, { withCredentials: true });
                setCandidate(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!candidate) return <div className="p-20 text-center font-bold text-gray-500 uppercase tracking-widest">Candidate not found.</div>;

    const totalApps = candidate.applications?.length || 0;
    const successRate = totalApps > 0 ? Math.round((candidate.applications?.filter(a => ['Offer', 'Accepted'].includes(a.status)).length / totalApps) * 100) : 0;
    const avgAiScore = totalApps > 0 ? Math.round(candidate.applications?.reduce((acc, a) => acc + (a.aiScore || 0), 0) / totalApps) : 0;
    const latestResume = candidate.resume || (candidate.applications?.length > 0 ? candidate.applications[0].resume : null);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/candidate-pool" className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-8 hover:text-blue-600 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Talent Pool
                </Link>

                {/* Candidate Header */}
                <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-blue-50/50 border border-gray-100 relative overflow-hidden mb-8">
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                        <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shadow-blue-100 shrink-0">
                            {candidate.name[0]}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic mb-2">{candidate.name}</h1>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                                <span className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    <Mail className="w-4 h-4 text-blue-500" /> {candidate.email}
                                </span>
                                {candidate.location && (
                                    <span className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        <MapPin className="w-4 h-4 text-blue-500" /> {candidate.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        {latestResume ? (
                            <a
                                href={`http://localhost:5000/${latestResume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                            >
                                Open Resume
                            </a>
                        ) : (
                            <div className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed border border-gray-200">
                                No Resume
                            </div>
                        )}
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Apps</p>
                            <p className="text-xl font-black text-gray-900">{totalApps}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Success Metric</p>
                            <p className="text-xl font-black text-gray-900">{successRate}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fit Quotient</p>
                            <p className="text-xl font-black text-gray-900">{avgAiScore}%</p>
                        </div>
                    </div>
                </div>

                {/* Application History */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic flex items-center gap-3 ml-4 mb-8">
                        <Briefcase className="w-5 h-5 text-blue-600" /> Total Job Insights
                    </h2>

                    {candidate.applications?.length > 0 ? candidate.applications.map(app => (
                        <div key={app._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-50/10 hover:shadow-2xl transition-all group overflow-hidden relative">
                            {/* AI Score Badge - Floating */}
                            <div className="absolute top-0 right-0 p-6">
                                <div className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2
                                    ${app.aiScore > 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                        app.aiScore > 50 ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            'bg-gray-50 text-gray-500 border border-gray-100'}
                                `}>
                                    <Target className="w-3 h-3" /> AI Match: {app.aiScore}%
                                </div>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex justify-between items-start pt-2">
                                    <div>
                                        <Link to={`/jobs/${app.job?._id}`} className="hover:text-blue-600 transition-colors">
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">{app.job?.title}</h3>
                                        </Link>
                                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                            <span className="text-gray-400">at</span> {app.job?.company}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                                            ${app.status === 'Accepted' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-100' :
                                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {app.status}
                                        </span>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center justify-end gap-1">
                                            <Calendar className="w-3 h-3" /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Expected Salary</p>
                                            <p className="text-xs font-bold text-gray-700">{app.job?.salary || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Job Type</p>
                                            <p className="text-xs font-bold text-gray-700">{app.job?.type || 'Full-time'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Location</p>
                                            <p className="text-xs font-bold text-gray-700">{app.job?.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {app.coverLetter && (
                                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative group">
                                        <Info className="w-4 h-4 text-blue-500 absolute top-4 right-4 opacity-30" />
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Cover Letter Snippet</p>
                                        <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">
                                            "{app.coverLetter}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No previous applications found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
