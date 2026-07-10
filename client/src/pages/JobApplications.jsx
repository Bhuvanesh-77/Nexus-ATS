import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [schedulingApp, setSchedulingApp] = useState(null);
    const [schedulingData, setSchedulingData] = useState({ date: "", location: "Main Office - Building A" });
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
                    withCredentials: true
                });
                setApplications(res.data);
            } catch (error) {
                console.error(error);
                alert("Error fetching applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);

    const [offeringApp, setOfferingApp] = useState(null);

    const handleStatusChange = async (id, newStatus) => {
        if (newStatus === 'Interview') {
            setSchedulingApp(id);
            return;
        }
        if (newStatus === 'Offer') {
            setOfferingApp(id);
            return;
        }

        performStatusUpdate(id, newStatus);
    };

    const performStatusUpdate = async (id, newStatus, extraData = {}) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus, ...extraData }, {
                withCredentials: true
            });
            setApplications(applications.map(app =>
                app._id === id ? { ...app, status: newStatus, ...extraData } : app
            ));

            setNotification({ message: `Successfully transitioned to ${newStatus}`, type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error(error);
            setNotification({ message: "Update failed", type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const confirmInterview = async () => {
        if (!schedulingData.date) return alert("Please specify a timestamp.");
        await performStatusUpdate(schedulingApp, 'Interview', {
            interviewDate: schedulingData.date,
            interviewLocation: schedulingData.location
        });
        setSchedulingApp(null);
    };

    const confirmOffer = async () => {
        await performStatusUpdate(offeringApp, 'Offer');
        setOfferingApp(null);
    };

    const sortedApplications = [...applications].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Pipeline...</p>
        </div>
    );

    return (
        <div className="container mx-auto p-12 relative min-h-screen pb-40">
            {notification && (
                <div className={`fixed bottom-12 right-12 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-right duration-500 text-white font-black text-xs uppercase tracking-widest
                    ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    {notification.message}
                </div>
            )}

            {/* Offer Confirmation Modal */}
            {offeringApp && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-3xl mb-8">💎</div>
                        <h3 className="text-3xl font-black text-gray-900 mb-4">Release Official Offer?</h3>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                            Moving this candidate to the <b>Offer</b> stage will automatically generate and email the official documentation. This action is irreversible once dispatched.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setOfferingApp(null)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-900 transition-colors">Abort</button>
                            <button onClick={confirmOffer} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">Confirm & Send</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scheduling Modal */}
            {schedulingApp && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-blue-100 rounded-[2rem] flex items-center justify-center text-3xl mb-8">🗓️</div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Sync Interview</h3>
                        <p className="text-gray-500 font-medium mb-8">Coordinate the virtual or physical meeting space.</p>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Timestamp</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-5 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                                    onChange={(e) => setSchedulingData({ ...schedulingData, date: e.target.value })}
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Location / Link</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Zoom Link or Room 402"
                                    className="w-full p-5 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                                    value={schedulingData.location}
                                    onChange={(e) => setSchedulingData({ ...schedulingData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setSchedulingApp(null)} className="flex-1 py-4 font-black text-gray-400">Cancel</button>
                            <button onClick={confirmInterview} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200">Finalize Schedule</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Applicant Tracking</h1>
                    <div className="mt-4 flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            {applications[0]?.job?.title || 'Loading Role...'}
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            {applications[0]?.job?.company || 'Organization'}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-blue-600">{applications.length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Candidates</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Candidate Pipeline</span>
                    <div className="flex gap-4">
                        <select className="text-xs font-bold border-gray-200 rounded-xl bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                            <option>Filter Status</option>
                            <option>High Scoring</option>
                        </select>
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Info</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                            <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Readiness</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Documents</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {sortedApplications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            {app.candidate?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <Link to={`/candidate/${app.candidate?._id}`} className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                                {app.candidate?.name || 'Unknown Candidate'}
                                            </Link>
                                            <div className="text-xs text-gray-500">ID: {app._id.slice(-6).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{app.candidate?.email || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 font-medium">{new Date(app.appliedAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`text-xs font-black mb-1 ${app.aiScore > 80 ? 'text-green-600' : 'text-blue-600'}`}>AI RANK</div>
                                        <div className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center text-sm font-bold shadow-sm
                                            ${app.aiScore > 75 ? 'bg-green-50 border-green-200 text-green-700' : app.aiScore > 40 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                            {app.aiScore || 0}%
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
            <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Watch Resume
            </a>
        </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border-none outline-none ring-1 tracking-tight
                                            ${app.status === 'Applied' ? 'bg-gray-100 text-gray-700 ring-gray-200' : ''}
                                            ${app.status === 'Screening' ? 'bg-sky-100 text-sky-800 ring-sky-200' : ''}
                                            ${app.status === 'Interview' ? 'bg-indigo-100 text-indigo-800 ring-indigo-200' : ''}
                                            ${app.status === 'Offer' ? 'bg-emerald-100 text-emerald-800 ring-emerald-200' : ''}
                                            ${app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 ring-rose-200' : ''}
                                        `}
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Screening">Shortlist (Screening)</option>
                                        <option value="Interview">Select for Interview</option>
                                        <option value="Offer">Release Offer</option>
                                        <option value="Rejected">Reject Candidate</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {applications.length === 0 && <div className="p-8 text-center text-gray-500">No applications yet.</div>}
            </div>
        </div>
    );
};

export default JobApplications;
