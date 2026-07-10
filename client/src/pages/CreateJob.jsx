import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...formData,
                requirements: formData.requirements.split(',').map(r => r.trim())
            };
            await axios.post("http://localhost:5000/api/jobs", jobData, { withCredentials: true });
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Error creating job");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-8">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Post New Position</h1>
                    <p className="text-gray-500 font-medium">Create a new job listing for your team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Job Title</label>
                                <input type="text" name="title" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" placeholder="e.g. Software Engineer" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Company</label>
                                <input type="text" name="company" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" placeholder="e.g. Antigravity" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Location</label>
                                <input type="text" name="location" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" placeholder="e.g. Remote / New York" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Job Type</label>
                                <select name="type" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs uppercase bg-white">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Salary Range</label>
                            <input type="text" name="salary" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" placeholder="e.g. $120k - $150k" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                            <textarea name="description" onChange={handleChange} rows="6" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 leading-relaxed" placeholder="Detailed role description..." required></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Requirements (comma-separated)</label>
                            <textarea name="requirements" onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 leading-relaxed" placeholder="React, Node.js, Problem Solving..."></textarea>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                        Create Job Posting
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;
