import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    Camera,
    AlertTriangle,
    ArrowRight,
    CheckCircle,
    Smartphone,
    Globe,
    Lock,
    Twitter,
    Linkedin,
    Mail,
    Github
} from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
            {/* Navigation */}
            <header className={`fixed top-0 w-full z-50 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'
                }`}>
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-600/20">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white uppercase">SafeGuard</span>
                </div>

                <nav className="hidden md:flex items-center gap-10">
                    <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">Features</a>
                    <a href="#solutions" className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">Solutions</a>
                    <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">Login</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-7 py-3 rounded-xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 uppercase text-xs tracking-widest">
                        Get Started
                    </Link>
                </nav>

                {/* Mobile Menu Button (Icon Only Placeholder) */}
                <button className="md:hidden text-white">
                    <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                    <div className="w-4 h-0.5 bg-white ml-2"></div>
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-20 px-6 md:px-12 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left z-10 animate-fade-in-scale">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold mb-6 tracking-widest uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v2.0 Neural Engine Optimized
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] premium-gradient-text">
                            Security <br /> <span className="text-white/40">Made Easy.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                            Stop threats before they escalate. Our AI-driven engine detects weapons and violent behavior in milliseconds with professional-grade accuracy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/dashboard" className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-95">
                                Enter Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="bg-transparent border-2 border-slate-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95">
                                Contact Sales
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-2xl lg:max-w-none group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="glass-morphism p-3 rounded-[2.5rem] border-white/10 transition-transform duration-700 shadow-2xl overflow-hidden shadow-blue-500/10 animate-float">
                            <img
                                src="/realistic_hero.png"
                                alt="Professional Security Monitoring Center"
                                className="w-full h-full object-cover rounded-[2rem] brightness-90 group-hover:brightness-100 transition-all duration-700 aspect-video shadow-inner"
                            />
                            <div className="absolute top-10 right-10 flex flex-col gap-2">
                                <div className="bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest animate-pulse border border-white/20 uppercase">Live Operations</div>
                                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-white/10 uppercase">System Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section id="features" className="py-32 px-6 md:px-12 bg-[#020617] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 animate-fade-in-scale">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Unrivaled Intelligence.</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                            Sophisticated models designed for zero false-positives and highest detection confidence in the most demanding environments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Camera className="text-blue-500" />}
                            title="Sub-100ms Latency"
                            desc="Real-time frame analysis with concurrent processing threads for instant response."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-emerald-500" />}
                            title="Cross-Device"
                            desc="View feeds and receive alerts on Mobile, Web, or Enterprise Monitoring Stations."
                        />
                        <FeatureCard
                            icon={<Globe className="text-purple-500" />}
                            title="Global Deployment"
                            desc="Cloud-native architecture allowing for multi-location synchronization."
                        />
                        <FeatureCard
                            icon={<Lock className="text-red-500" />}
                            title="Secure Storage"
                            desc="AES-256 encrypted storage for incident evidence and logs."
                        />
                    </div>
                </div>
            </section>

            {/* Solutions Section (Quick Placeholder) */}
            <section id="solutions" className="py-32 px-6 md:px-12 bg-slate-950/50">
                <div className="max-w-7xl mx-auto glass-morphism rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-12 border-white/5">
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to Secure Your <span className="text-blue-500">Facility?</span></h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">Join over 500+ enterprises worldwide using CaneGuard AI to protect their people and assets around the clock.</p>
                        <ul className="space-y-4 mb-12">
                            {['Easy API Integration', '24/7 Priority Support', 'Custom Model Training'].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-200 font-bold">
                                    <div className="bg-blue-600/20 p-1 rounded-full"><CheckCircle className="text-blue-500 w-4 h-4" /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 uppercase text-sm tracking-widest">
                            Book a Consultation
                        </button>
                    </div>
                    <div className="flex-1 w-full bg-slate-900 aspect-square rounded-[2rem] overflow-hidden border border-white/5 relative group cursor-pointer">
                        <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/40 transition-all"></div>
                        <img src="/auth_bg.png" className="w-full h-full object-cover mix-blend-overlay brightness-50" alt="Consultation" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-950 shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="pt-32 pb-12 px-6 md:px-12 bg-[#020617] border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="text-blue-600 w-8 h-8" />
                            <span className="text-2xl font-black uppercase tracking-tighter">SafeGuard</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium pr-8">
                            Leading the industry in AI-native surveillance and real-time threat detection systems for the modern world.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="p-2.5 bg-slate-900 rounded-xl text-slate-400 hover:text-white hover:bg-blue-600 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Solutions</h4>
                        <ul className="space-y-4">
                            {['Commercial Real Estate', 'Educational Campuses', 'Healthcare Facilities', 'Industrial Logistics'].map((item, i) => (
                                <li key={i}><a href="#" className="text-slate-500 hover:text-blue-500 text-sm font-bold transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Case Studies', 'AI Ethics', 'Contact'].map((item, i) => (
                                <li key={i}><a href="#" className="text-slate-500 hover:text-blue-500 text-sm font-bold transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
                        <p className="text-slate-500 text-sm mb-6 font-medium">Get the latest insights on AI security architecture.</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Email address"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button className="absolute right-2 top-1.5 bg-blue-600 p-1.5 rounded-lg text-white hover:bg-blue-700 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600">
                    <p className="text-xs font-bold uppercase tracking-widest">© 2026 SafeGuard Industrial. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-xs font-bold hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</a>
                        <a href="#" className="text-xs font-bold hover:text-white transition-colors uppercase tracking-widest">Terms of Service</a>
                        <a href="#" className="text-xs font-bold hover:text-white transition-colors uppercase tracking-widest">Security Audit</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="group glass-morphism p-10 rounded-[2rem] border-white/5 hover:bg-white/10 transition-all duration-500 hover:translate-y-[-10px]">
        <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all border border-white/5 shadow-inner">
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h3 className="text-2xl font-extrabold mb-4 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
);

export default LandingPage;
