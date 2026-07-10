import { Link } from "react-router-dom";
import { Rocket, BarChart3, ShieldCheck, Globe, Zap, Users, ArrowRight } from "lucide-react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-900 selection:bg-blue-500/30">
            {/* Hero Section - Ultra Premium Dark */}
            <header className="relative pt-32 pb-48 overflow-hidden">
                {/* Mesh Gradient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-8 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                            <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">NextGen Talent Acquisition</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] uppercase italic tracking-tighter">
                            Scale your vision <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">with precision.</span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium">
                            Nexus ATS is the world’s first autonomous recruitment ecosystem.
                            Leveraging deep-neural parsing to match talent with extraordinary opportunities in milliseconds.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link to="/jobs" className="group px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95">
                                Explore Careers
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link to="/register" className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95">
                                For Enterprises
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Metrics */}
                <div className="container mx-auto px-8 mt-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
                        {[
                            { label: "Talent Indexed", value: "2.4M+" },
                            { label: "Avg. Match Accuracy", value: "98.2%" },
                            { label: "Deployment Speed", value: "< 24hr" },
                            { label: "Enterprise Partners", value: "450+" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Intelligence Section */}
            <section className="py-32 bg-gray-950 relative">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight italic mb-6">Autonomous <span className="text-blue-500">Intelligence</span></h2>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                Beyond keyword matching. Our system understands context, experience density,
                                and cultural trajectory to predict the perfect hire.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-6xl font-black text-white/5 uppercase tracking-tighter select-none mb-[-2rem]">TECHNOLOGY</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Rocket className="w-8 h-8 text-blue-500" />,
                                title: "Neural Screening",
                                desc: "Proprietary NLP engine that deciphers technical depth and implicit expertise within resumes."
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
                                title: "Pipeline Analytics",
                                desc: "Real-time conversion modeling that identifies bottlenecks in your recruitment velocity."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
                                title: "Verified Offers",
                                desc: "End-to-end cryptographic offer management with integrated acceptance verification."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                                <div className="mb-8 p-4 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global CTA */}
            <section className="py-32">
                <div className="container mx-auto px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-8">
                                Ready for the <br /> workforce of 2030?
                            </h2>
                            <Link to="/register" className="px-12 py-6 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all active:scale-95">
                                Initialize System
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">N</div>
                        <span className="text-white font-black uppercase tracking-widest text-xs">Nexus <span className="text-blue-500">ATS</span></span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 Space-Time Recruiting Systems</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
