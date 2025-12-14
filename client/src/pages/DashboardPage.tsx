export default function DashboardPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of your AI sales performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Leads Found', value: '1,248', color: 'text-slate-900' },
                    { label: 'Emails Sent', value: '856', color: 'text-blue-600' },
                    { label: 'Replies Received', value: '42', color: 'text-indigo-600' },
                    { label: 'Meetings Booked', value: '12', color: 'text-emerald-600' },
                ].map((stat, i) => (
                    <div key={i} className="card hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                        <div className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                                    {String.fromCharCode(64 + i)}A
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">New Reply from Agency {i}</div>
                                    <div className="text-sm text-slate-500 line-clamp-1">"Interested, let's chat..."</div>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                Interested
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
