import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Camera,
    Bell,
    LogOut,
    ShieldCheck,
    ShieldAlert,
    Activity,
    Clock,
    Zap,
    FileText,
    Settings,
    Search,
    Download,
    TrendingUp,
    Shield,
    Users,
    Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [summary, setSummary] = useState({ total: 0, critical: 0 });
    const [status, setStatus] = useState({
        weaponDetected: 'No',
        fightDetected: 'No',
        fireDetected: 'No',
        confidenceScore: 0,
        threatLevel: 'Low'
    });
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const alertInterval = useRef(null);

    const fetchAlerts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:8000/alerts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(response.data);

            // Fetch global summary
            const summaryRes = await axios.get('http://localhost:8000/alerts/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(summaryRes.data);
        } catch (err) {
            console.error("Failed to fetch alerts", err);
        }
    };

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/status');
            const data = response.data;

            let threatLevel = 'Low';
            if (data.threat_score > 70) threatLevel = 'High';
            else if (data.threat_score > 40) threatLevel = 'Medium';

            setStatus({
                weaponDetected: data.is_weapon ? 'Yes' : 'No',
                fightDetected: data.is_fight ? 'Yes' : 'No',
                fireDetected: data.is_fire ? 'Yes' : 'No',
                confidenceScore: data.threat_score,
                threatLevel: threatLevel
            });
        } catch (err) {
            console.error("Failed to fetch current status", err);
        }
    };

    const handleToggleMonitoring = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!isMonitoring) {
                await axios.post('http://localhost:8000/start-detection', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsMonitoring(true);
            } else {
                await axios.post('http://localhost:8000/stop-detection', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsMonitoring(false);
            }
        } catch (err) {
            console.error("Failed to toggle monitoring", err);
        }
    };

    useEffect(() => {
        let statusInterval;
        if (isMonitoring) {
            alertInterval.current = setInterval(fetchAlerts, 3000);
            statusInterval = setInterval(fetchStatus, 1000);
        } else {
            clearInterval(alertInterval.current);
            clearInterval(statusInterval);
        }
        return () => {
            clearInterval(alertInterval.current);
            clearInterval(statusInterval);
        };
    }, [isMonitoring]);

    // Initial fetch
    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const renderDashboard = () => (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Live Feed - 3/4 Width */}
            <div className="lg:col-span-3 space-y-8">
                <div className="aspect-[16/9] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                    {isMonitoring ? (
                        <img
                            src="http://localhost:8000/video_feed"
                            alt="Live Stream"
                            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-900/50 backdrop-blur-sm">
                            <Camera className="w-16 h-16 mb-4 opacity-20 animate-pulse" />
                            <p className="font-bold uppercase tracking-widest text-sm">Camera Inactive</p>
                            <p className="text-xs mt-2 opacity-50 font-medium">Click "Start Monitoring" to begin.</p>
                        </div>
                    )}
                    {isMonitoring && (
                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full text-xs font-black animate-pulse border border-white/20">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            LIVE CAMERA
                        </div>
                    )}
                </div>

                {/* Real-time Logs Summary */}
                <div className="glass-morphism rounded-3xl p-6 border-white/5 h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-3 text-blue-400">
                            <Zap className="w-4 h-4" />
                            Recent Alerts
                        </h3>
                        <Link to="#" onClick={() => setActiveTab('alerts')} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">View All History</Link>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {alerts.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-600 text-sm font-medium">
                                No incident detections recorded yet.
                            </div>
                        ) : (
                            alerts.slice(0, 10).map((alert, idx) => (
                                <div key={idx} className="bg-slate-900/50 p-5 rounded-[1.5rem] border border-white/5 flex items-center justify-between hover:border-blue-500/30 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${alert.threat_level === 'High' ? 'bg-red-500/20 text-red-500 shadow-lg shadow-red-500/10' :
                                            alert.threat_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            <AlertTriangleIcon level={alert.threat_level} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-100 uppercase tracking-tight">{alert.threat_type}</p>
                                            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase mt-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(alert.timestamp).toLocaleTimeString()} • CAM_01
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest border ${alert.threat_level === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            alert.threat_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {alert.threat_level} Danger
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Status Panel - 1/4 Width */}
            <div className="lg:col-span-1 space-y-6">
                <StatusCard
                    title="Detection Status"
                    icon={<ShieldAlert className="text-blue-500 w-4 h-4" />}
                >
                    <div className="space-y-5">
                        <StatusItem label="Weapon Detected" value={status.weaponDetected} highlight={status.weaponDetected === 'Yes'} />
                        <StatusItem label="Fight Detected" value={status.fightDetected} highlight={status.fightDetected === 'Yes'} />
                        <StatusItem label="Fire Detected" value={status.fireDetected} highlight={status.fireDetected === 'Yes'} />
                        <StatusItem label="AI Confidence" value={`${status.confidenceScore}%`} />
                        <div className="pt-6 border-t border-white/5 mt-4">
                            <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest font-black">Threat Status</p>
                            <p className={`text-4xl font-black tracking-tighter ${status.threatLevel === 'High' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                status.threatLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                {status.threatLevel.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </StatusCard>

                <StatusCard title="System Health" icon={<Activity className="text-emerald-500 w-4 h-4" />}>
                    <div className="space-y-4">
                        <HealthItem label="AI Server" status="online" />
                        <HealthItem label="Camera Node" status="online" />
                        <HealthItem label="Database" status="secure" />
                        <HealthItem label="Storage" status="active" />
                    </div>
                </StatusCard>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <Shield className="w-10 h-10 mb-6 text-white/40" />
                    <h4 className="text-xl font-black mb-3">System Support</h4>
                    <p className="text-blue-100/70 text-xs mb-6 font-medium leading-relaxed">Need help with setup or adding more cameras?</p>
                    <button className="w-full bg-white text-blue-700 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Contact Us</button>
                </div>
            </div>
        </div>
    );

    const renderAlerts = () => (
        <div className="space-y-8 animate-fade-in-scale">
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search alert history..."
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="bg-slate-900 border border-white/5 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="bg-blue-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                        Filter Results
                    </button>
                </div>
            </div>

            <div className="glass-morphism rounded-[2.5rem] border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-white/5 font-black text-[10px] uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-8 py-6">Timestamp</th>
                            <th className="px-8 py-6">Event Type</th>
                            <th className="px-8 py-6">Confidence</th>
                            <th className="px-8 py-6">Threat Level</th>
                            <th className="px-8 py-6">Source</th>
                            <th className="px-8 py-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-slate-600 font-medium">No alerts found.</td>
                            </tr>
                        ) : (
                            alerts.map((alert, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-medium text-slate-400">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-100 uppercase tracking-tight">{alert.threat_type}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 group-hover:bg-blue-400 transition-all"
                                                    style={{ width: `${alert.confidence_score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-200">{alert.confidence_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-black border ${alert.threat_level === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {alert.threat_level}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">CAM_001_A</td>
                                    <td className="px-8 py-6">
                                        <button className="text-blue-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-blue-500/30">View Capture</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReports = () => {
        // --- Calculate Stats ---
        const totalAlerts = alerts.length;
        const criticalAlerts = alerts.filter(a => a.threat_level === 'High').length;

        // --- Alert Types Distribution ---
        const typeCounts = alerts.reduce((acc, alert) => {
            const type = alert.threat_type.toLowerCase();
            if (type.includes('weapon')) acc.weapon = (acc.weapon || 0) + 1;
            else if (type.includes('fight')) acc.fight = (acc.fight || 0) + 1;
            else if (type.includes('fire')) acc.fire = (acc.fire || 0) + 1;
            else acc.other = (acc.other || 0) + 1;
            return acc;
        }, { weapon: 0, fight: 0, fire: 0, other: 0 });

        // --- Hourly Activity (Last 12 hours) ---
        const hourlyTrend = Array.from({ length: 12 }, (_, i) => {
            const hour = new Date();
            hour.setHours(hour.getHours() - (11 - i));
            const count = alerts.filter(a => {
                const alertDate = new Date(a.timestamp);
                return alertDate.getHours() === hour.getHours() &&
                    alertDate.getDate() === hour.getDate();
            }).length;
            return { label: hour.getHours() + ":00", count };
        });

        const maxCount = Math.max(...hourlyTrend.map(h => h.count), 5); // Base of 5 for scaling

        return (
            <div className="space-y-8 animate-fade-in-scale">
                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnalyticCard title="Total Alerts" value={summary.total} subtitle="Lifetime" icon={<TrendingUp className="text-emerald-500" />} />
                    <AnalyticCard title="Danger Events" value={summary.critical} subtitle="Critical" icon={<ShieldAlert className="text-red-500" />} />
                    <AnalyticCard title="System Status" value="Online" subtitle="Healthy" icon={<Activity className="text-blue-500" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Trend Chart */}
                    <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 h-[450px] flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Activity Trend</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase mt-1">Alerts in last 12 hours</p>
                            </div>
                            <TrendingUp className="text-blue-500 w-6 h-6 opacity-40" />
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-3 px-2">
                            {hourlyTrend.map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full flex flex-col items-center">
                                        <div
                                            className="w-full bg-blue-600/20 group-hover:bg-blue-500/40 rounded-t-lg transition-all duration-700"
                                            style={{ height: `${(h.count / maxCount) * 200}px` }}
                                        >
                                            {h.count > 0 && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {h.count}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-black uppercase mt-4 rotate-45 md:rotate-0">{h.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alert Type Breakdown */}
                    <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 h-[450px] flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Alert Types</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase mt-1">Breakdown by category</p>
                            </div>
                            <Users className="text-emerald-500 w-6 h-6 opacity-40" />
                        </div>

                        <div className="space-y-6 flex-1 flex flex-col justify-center">
                            <StatBar label="Weapon Detection" count={typeCounts.weapon} total={totalAlerts} color="bg-red-500" />
                            <StatBar label="Fight Detection" count={typeCounts.fight} total={totalAlerts} color="bg-orange-500" />
                            <StatBar label="Fire Detection" count={typeCounts.fire} total={totalAlerts} color="bg-amber-500" />
                            <StatBar label="Others" count={typeCounts.other} total={totalAlerts} color="bg-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col items-center py-10 px-6 backdrop-blur-2xl">
                <div className="flex items-center gap-4 mb-16 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-all shadow-xl shadow-blue-600/20">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">SafeGuard</span>
                </div>

                <nav className="flex-1 w-full space-y-3">
                    <SidebarLink
                        icon={<LayoutDashboard />}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <SidebarLink
                        icon={<Bell />}
                        label="Alert History"
                        active={activeTab === 'alerts'}
                        onClick={() => setActiveTab('alerts')}
                    />
                    <SidebarLink
                        icon={<FileText />}
                        label="Reports"
                        active={activeTab === 'reports'}
                        onClick={() => setActiveTab('reports')}
                    />
                    <div className="pt-8 pb-4">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 ml-4 mb-4">Support</p>
                        <SidebarLink
                            icon={<Settings />}
                            label="Configuration"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                    </div>
                </nav>

                <div className="w-full pt-10 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-500 hover:text-white hover:bg-red-500 transition-all rounded-2xl group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-xs">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
                <header className="flex justify-between items-center px-12 py-10 border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 md:z-10">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase">
                            {activeTab === 'dashboard' ? 'Dashboard' :
                                activeTab === 'alerts' ? 'Alert History' :
                                    activeTab === 'reports' ? 'Reports' : 'Settings'}
                        </h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">
                            {activeTab === 'dashboard' ? 'Real-time AI surveillance overview' :
                                activeTab === 'alerts' ? 'View all past alerts' :
                                    activeTab === 'reports' ? 'System stats and data' : 'Manage your system settings'}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {activeTab === 'dashboard' && (
                            <button
                                onClick={handleToggleMonitoring}
                                className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 transition-all shadow-2xl ${isMonitoring
                                    ? 'bg-red-600 text-white shadow-red-600/30 hover:bg-red-700'
                                    : 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700'
                                    }`}
                            >
                                <Activity className={`w-5 h-5 ${isMonitoring ? 'animate-pulse' : ''}`} />
                                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                            </button>
                        )}
                        <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'alerts' && renderAlerts()}
                    {activeTab === 'reports' && renderReports()}
                    {activeTab === 'settings' && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <Settings className="w-16 h-16 mb-4" />
                            <h3 className="text-2xl font-black">Settings</h3>
                            <p className="text-sm font-medium">Access to neural weights and gateway parameters is restricted.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Helper Components
const SidebarLink = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
    >
        {React.cloneElement(icon, { className: `w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'}` })}
        <span className={`font-black uppercase tracking-widest text-[10px] ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
    </button>
);

const StatusCard = ({ title, icon, children }) => (
    <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-900 p-2 rounded-lg border border-white/5">{icon}</div>
            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-500">{title}</h3>
        </div>
        {children}
    </div>
);

const StatusItem = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-white/5">
        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
        <span className={`font-black tracking-tight ${highlight ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-slate-100'}`}>{value}</span>
    </div>
);

const HealthItem = ({ label, status }) => (
    <div className="flex justify-between items-center group cursor-default">
        <span className="text-slate-500 text-xs font-bold group-hover:text-slate-300 transition-colors uppercase tracking-widest">{label}</span>
        <span className="text-emerald-500 text-[8px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 tracking-widest">{status.toUpperCase()}</span>
    </div>
);

const AnalyticCard = ({ title, value, subtitle, icon }) => (
    <div className="glass-morphism p-8 rounded-[2.5rem] border-white/5 hover:bg-white/5 transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{subtitle}</span>
        </div>
        <h3 className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{title}</h3>
        <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
);

const AlertTriangleIcon = ({ level }) => {
    if (level === 'High') return <ShieldAlert className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
};

const StatBar = ({ label, count, total, color }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>{label}</span>
                <span>{count} Events ({Math.round(percentage)}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full ${color} transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Dashboard;
