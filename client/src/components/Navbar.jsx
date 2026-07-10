import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout');
            logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="sticky top-0 z-[100] bg-gray-900/80 backdrop-blur-md border-b border-white/5 py-4">
            <div className="container mx-auto px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic transition-transform group-hover:scale-110 shadow-lg shadow-blue-500/20">
                        N
                    </div>
                    <span className="text-xl font-black text-white tracking-tight uppercase italic">Nexus<span className="text-blue-600">ATS</span></span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/jobs" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Jobs</Link>
                        {user && (
                            <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                        )}
                        {(user?.role === 'recruiter' || user?.role === 'admin') && (
                            <Link to="/candidate-pool" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Talent Pool</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Admin</Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Logged in as</p>
                                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{user.name}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-rose-50 hover:text-rose-600 transition-all border border-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</Link>
                                <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
