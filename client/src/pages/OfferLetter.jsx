import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, CheckCircle, ShieldCheck, Download, Printer, ArrowLeft } from 'lucide-react';

const OfferLetter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepted, setIsAccepted] = useState(false);
    const [signature, setSignature] = useState('');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/applications/${id}`, { withCredentials: true });
                setApplication(res.data);
                if (res.data.status === 'Accepted') setIsAccepted(true);
            } catch (err) {
                console.error("Offer Letter Load Error:", err);
                const msg = err.response?.data?.message || "Failed to load offer details. Please ensure you have permission to view this document.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    const handleAccept = async () => {
        if (!signature.trim()) return alert("Please type your full name in the signature field to accept.");

        try {
            await axios.put(`http://localhost:5000/api/applications/${id}/status`,
                { status: 'Accepted', signature },
                { withCredentials: true }
            );
            setIsAccepted(true);
        } catch (err) {
            console.error(err);
            alert("Failed to process acceptance. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 font-black uppercase text-xs tracking-widest">Generating Your Offer...</p>
        </div>
    );

    if (error || !application) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-rose-100 max-w-lg text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Documentation Error</h2>
                <p className="text-gray-500 mb-8 font-medium">{error || "The requested offer letter could not be retrieved."}</p>
                <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Return to Dashboard</button>
            </div>
        </div>
    );

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#f8f9fc] py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Navigation Bar */}
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-black text-xs uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 shadow-sm transition-all" title="Print Offer">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 shadow-sm transition-all" title="Download PDF">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* The Offer Letter Document */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 relative">

                    {/* Branded Header */}
                    <div className="bg-gray-900 p-12 text-white flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-black italic tracking-tighter">ANTIGRAVITY <span className="text-blue-500">ATS</span></span>
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Employment Agreement</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">OFFER ID</p>
                            <p className="text-xl font-black text-white/50">{application._id.substring(application._id.length - 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-16 space-y-12">

                        {/* Date & Salutation */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">DATED</p>
                                <p className="text-lg font-black text-gray-900 italic">{today}</p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">Subject: Offer of Employment</h2>

                            <p className="text-gray-600 font-medium leading-relaxed mb-8">
                                Dear <strong className="text-gray-900 font-black">{application.candidate?.name}</strong>,<br /><br />
                                On behalf of <strong className="text-blue-600 font-black">{application.job?.company || "Our Company"}</strong>, we are thrilled to formally offer you the position of <strong className="text-gray-900 font-black">{application.job?.title || "Team Member"}</strong>. This offer is a testament to your outstanding performance during our selection process and we believe your expertise will be instrumental in our continued success.
                            </p>

                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-3">
                                <div className="w-8 h-px bg-gray-200"></div> Key Employment Terms
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Compensation</p>
                                    <p className="text-3xl font-black text-emerald-600">{application.job?.salary || "Competitive"}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">ANNUAL BASE SALARY</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Location</p>
                                    <p className="text-xl font-black text-gray-900">{application.job?.location || "Remote/Headquarters"}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">PHYSICAL / HYBRID OFFICE</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Employment Type</p>
                                    <p className="text-xl font-black text-gray-900">{application.job?.type || "Full-time"}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">CONTRACTUAL STATUS</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Benefits Portfolio</p>
                                    <ul className="text-xs font-bold text-gray-600 space-y-1">
                                        <li>• Standard Healthcare Coverage</li>
                                        <li>• Performance Bonus Incentives</li>
                                        <li>• Remote Workspace Allowance</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="text-gray-600 font-medium leading-relaxed">
                                This offer is contingent upon successful verification of your work eligibility and a final background evaluation. We anticipate your start date to be within 15 calendar days of this acceptance unless otherwise coordinated.
                            </p>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Acceptance Section */}
                        <div className="bg-[#f0f4ff] rounded-[3rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                            {isAccepted ? (
                                <div className="text-center animate-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2">Offer Accepted!</h3>
                                    <p className="text-gray-500 font-bold text-sm mb-6">You've successfully secured your position at {application.job?.company || "our team"}.</p>
                                    <div className="border-t border-gray-100 pt-6 mt-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Digitally Signed By</p>
                                        <p className="text-2xl font-black text-blue-600 italic font-signature">{signature || application.candidate.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Official Acceptance</h3>
                                    <p className="text-gray-500 font-bold font-xs mb-8 uppercase tracking-widest">Sign below to execute this agreement</p>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <input
                                                type="text"
                                                placeholder="Enter full name as digital signature"
                                                className="w-full bg-white p-6 rounded-2xl border border-blue-100 outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-xl transition-all"
                                                value={signature}
                                                onChange={(e) => setSignature(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
                                            <ShieldCheck className="text-blue-500 w-6 h-6" />
                                            <p className="text-[10px] text-gray-400 font-bold leading-tight uppercase">
                                                By signing, you agree to the terms of employment and confirm that all provided documentation is accurate.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleAccept}
                                            className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98]"
                                        >
                                            Execute Agreement
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        SECURE OFFER GENERATED BY ANTIGRAVITY ATS CLOUD SERVICES
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-signature { font-family: 'Dancing Script', cursive; }
            `}} />
        </div>
    );
};

export default OfferLetter;
