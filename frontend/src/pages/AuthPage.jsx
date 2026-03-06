import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const AuthPage = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (type === 'login') {
                const data = await login(email, password);
                loginUser(data.access_token);
                navigate('/dashboard');
            } else {
                await register(email, password);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
            {/* Left Side: Visual/Branding */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/auth_bg.png"
                        alt="Security System"
                        className="w-full h-full object-cover brightness-[0.4] scale-105 animate-float"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl animate-fade-in-scale">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">Back to Home</span>
                    </Link>

                    <div className="bg-blue-600/20 border border-blue-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                        <Shield className="text-blue-400 w-8 h-8" />
                    </div>

                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                        Best <br />
                        <span className="text-blue-500">Security</span> <br />
                        For You.
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                            <span className="font-medium">99% Accuracy</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                            <span className="font-medium">Real-time Processing</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                            <span className="font-medium">Secure and Private</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#020617] relative">
                <div className="w-full max-w-md animate-fade-in-scale">
                    <div className="text-center md:text-left mb-10">
                        <h1 className="text-4xl font-black text-white mb-3">
                            {type === 'login' ? 'Login' : 'Signup'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {type === 'login'
                                ? 'Sign in to start monitoring your area.'
                                : 'Start using the best AI security today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-slate-900 transition-all font-medium"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-slate-900 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {type === 'login' && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs font-bold text-blue-500 hover:text-white transition-colors uppercase tracking-widest">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : type === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
                        </button>

                        <div className="text-center mt-10">
                            <p className="text-slate-500 text-sm font-medium">
                                {type === 'login' ? "New user?" : "Already a user?"}{' '}
                                <Link
                                    to={type === 'login' ? '/register' : '/login'}
                                    className="text-white hover:text-blue-400 font-black ml-2 underline underline-offset-4 decoration-blue-500 transition-all"
                                >
                                    {type === 'login' ? 'Create Account' : 'Sign In'}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
