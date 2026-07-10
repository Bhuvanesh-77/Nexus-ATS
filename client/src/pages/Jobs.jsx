import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        type: "All",
        location: "All"
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/jobs");
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const uniqueLocations = ["All", ...new Set(jobs.map(j => j.location))];
    const uniqueTypes = ["All", ...new Set(jobs.map(j => j.type))];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filters.type === "All" || job.type === filters.type;
        const matchesLocation = filters.location === "All" || job.location === filters.location;

        return matchesSearch && matchesType && matchesLocation;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12">
            <div className="container mx-auto px-8 max-w-7xl">
                <div className="flex flex-col mb-12 gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight italic">Explore <span className="text-blue-600">Opportunities</span></h1>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Connect with our network of {jobs.length} industry leaders</p>
                        </div>
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search roles or companies..."
                                className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-none ring-1 ring-gray-200 outline-none focus:ring-4 focus:ring-blue-100 shadow-2xl shadow-blue-100/20 bg-white font-bold text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-6 top-5.5 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Filter By</p>
                        <select
                            className="bg-white px-6 py-2.5 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 font-black text-[9px] uppercase tracking-widest text-gray-600 shadow-sm"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="All">All Types</option>
                            {uniqueTypes.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select
                            className="bg-white px-6 py-2.5 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 font-black text-[9px] uppercase tracking-widest text-gray-600 shadow-sm"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        >
                            <option value="All">All Locations</option>
                            {uniqueLocations.filter(l => l !== "All").map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isRecruiter={user?.role === 'recruiter' && (user._id === job.postedBy?._id || user._id === job.postedBy)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
