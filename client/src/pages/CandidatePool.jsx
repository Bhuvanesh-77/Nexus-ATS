import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, User, Mail, Briefcase, FileText, ChevronRight } from "lucide-react";

const CandidatePool = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/applications/candidate-pool", { withCredentials: true });
                setCandidates(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Candidate <span className="text-blue-600">Database</span></h1>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Access expertise from across all your job postings</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-4.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredCandidates.map(candidate => (
                            <div key={candidate._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-50/20 hover:shadow-2xl hover:shadow-blue-50/50 transition-all group flex flex-col md:flex-row gap-8">
                                <div className="w-24 h-24 bg-blue-600/5 rounded-[2rem] flex items-center justify-center text-blue-600 text-3xl font-black italic shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {candidate.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Link to={`/candidate/${candidate._id}`} className="hover:text-blue-600 transition-colors">
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{candidate.name}</h3>
                                            </Link>
                                            <p className="text-gray-400 font-bold text-[10px] flex items-center gap-2 uppercase tracking-widest mt-1">
                                                <Mail className="w-3 h-3" /> {candidate.email}
                                            </p>
                                        </div>
                                        {candidate.resume ? (
                                            <a
                                                href={`http://localhost:5000/${candidate.resume}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all"
                                                title="View Resume"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </a>
                                        ) : (
                                            <div
                                                className="p-3 bg-gray-50 text-gray-200 cursor-not-allowed rounded-2xl"
                                                title="No Resume Uploaded"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>


                                    <div className="pt-6 border-t border-gray-50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Briefcase className="w-3 h-3 text-blue-500" /> Recent Activity
                                        </p>
                                        <div className="space-y-2">
                                            {candidate.appliedJobs.slice(0, 2).map(job => (
                                                <div key={job.id} className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-700">{job.title}</span>
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg font-black uppercase text-[8px] tracking-widest">
                                                        {job.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidatePool;
