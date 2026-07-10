import { useEffect, useState } from "react";
import axios from "axios";
import { User, Briefcase, Building, CheckCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/stats", { withCredentials: true }),
                    axios.get("http://localhost:5000/api/applications/all", { withCredentials: true })
                ]);
                setStats(statsRes.data);
                setApplications(appsRes.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 5));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto p-8 space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Console</h1>
                <p className="text-gray-500 mt-2 font-medium">Real-time overview of recruitment activity across all companies.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Total Users", value: stats?.totalUsers, color: "bg-blue-600", icon: <User className="w-6 h-6" /> },
                    { label: "Open Roles", value: stats?.totalJobs, color: "bg-indigo-600", icon: <Briefcase className="w-6 h-6" /> },
                    { label: "Applications", value: stats?.totalApplications, color: "bg-violet-600", icon: <CheckCircle className="w-6 h-6" /> }
                ].map((stat, i) => (
                    <div key={i} className={`${stat.color} p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 opacity-80">
                                {stat.icon}
                                <span className="text-sm font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <p className="text-5xl font-black">{stat.value}</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            {stat.icon && cloneElement(stat.icon, { className: "w-32 h-32" })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Distribution */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-2 italic">
                        <Clock className="w-5 h-5 text-blue-600" /> Pipeline Status
                    </h3>
                    <div className="space-y-6">
                        {stats?.applicationsByStatus.map(item => (
                            <div key={item._id} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-700 capitalize">{item._id}</span>
                                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{item.count}</span>
                                </div>
                                <div className="bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(item.count / (stats.totalApplications || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-black italic flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" /> Recent Applications
                        </h3>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 underline">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Applicant</th>
                                    <th className="px-8 py-4">Job Role</th>
                                    <th className="px-8 py-4">Company</th>
                                    <th className="px-8 py-4 text-center">Score</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.candidate?.name || 'Anonymous'}</div>
                                            <div className="text-[10px] text-gray-400 font-medium font-mono">{new Date(app.appliedAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-semibold text-gray-700">{app.job?.title || 'Open Role'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                                <Building className="w-3 h-3" />
                                                {app.job?.company || 'Local Org'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`text-xs font-black p-2 rounded-xl ${app.aiScore > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {app.aiScore || 0}%
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ring-1
                                                ${app.status === 'Applied' ? 'bg-gray-100 text-gray-600 ring-gray-200' : ''}
                                                ${app.status === 'Interview' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' : ''}
                                                ${app.status === 'Offer' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : ''}
                                                ${app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 ring-rose-100' : 'bg-blue-50 text-blue-600 ring-blue-100'}
                                            `}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {applications.length === 0 && <div className="p-12 text-center text-gray-400 font-medium italic">Waiting for new talent...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple icon clone helper
function cloneElement(element, props) {
    return <element.type {...element.props} {...props} />;
}

export default AdminDashboard;
