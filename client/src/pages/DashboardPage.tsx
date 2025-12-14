import { useEffect, useState } from 'react';
import api from '../utils/api';
import StatsChart from '../components/StatsChart';
import LeadTable from '../components/LeadTable';
import { Users, Send, MessageSquare, CalendarCheck } from 'lucide-react';
import AIChatWidget from '../components/AIChatWidget'; // Will be created next

export default function DashboardPage() {
    const [metrics, setMetrics] = useState({
        totalLeads: 0,
        emailsSent: 0,
        replies: 0,
        meetingsBooked: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, chartRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/chart-data')
                ]);
                setMetrics(statsRes.data.metrics);
                setChartData(chartRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Polling every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { label: 'Total Leads', value: metrics.totalLeads, icon: Users, color: 'text-slate-900', bg: 'bg-slate-100' },
        { label: 'Emails Sent', value: metrics.emailsSent, icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Replies', value: metrics.replies, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Meetings', value: metrics.meetingsBooked, icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    return (
        <div className="space-y-6 pb-20 relative"> {/* pb-20 for chat widget space */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time overview of your sales performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                            <div className="text-2xl font-bold text-slate-900">{loading ? '-' : stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Outreach Performance via AI</h3>
                    <StatsChart data={chartData} />
                </div>
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    {/* Placeholder for future quick actions or mini-feed */}
                    <div className="space-y-3">
                        <button className="btn btn-outline w-full justify-start gap-2">
                            <Send size={16} /> Start New Campaign
                        </button>
                        <button className="btn btn-outline w-full justify-start gap-2">
                            <Users size={16} /> Import Leads (CSV)
                        </button>
                    </div>

                    <div className="mt-8">
                        <h4 className="font-semibold text-slate-900 mb-2">System Status</h4>
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            All Systems Operational
                        </div>
                    </div>
                </div>
            </div>

            <LeadTable />

            <AIChatWidget />
        </div>
    );
}
