import { useState, useEffect } from 'react';
import api from '../utils/api';
import clsx from 'clsx';
import { Search, MessageSquare } from 'lucide-react';

interface Lead {
    id: string;
    name: string | null;
    companyName: string;
    email: string;
    status: string;
    campaign?: { name: string };
    updatedAt: string;
}

export default function LeadTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (search) params.search = search;
                if (statusFilter) params.status = statusFilter;

                const { data } = await api.get('/dashboard/leads', { params });
                setLeads(data);
            } catch (error) {
                console.error("Failed to fetch leads");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchLeads, 300); // Debounce
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    return (
        <div className="card space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900">Leads</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="input pl-9"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="input w-40"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="REPLIED">Replied</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="ESCALATE">Escalated</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-medium">
                            <th className="pb-3 pl-2">Name / Company</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Campaign</th>
                            <th className="pb-3">Last Activity</th>
                            <th className="pb-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading && leads.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading...</td></tr>
                        ) : leads.map((lead) => (
                            <tr key={lead.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 pl-2">
                                    <div className="font-medium text-slate-900">{lead.name || lead.email}</div>
                                    <div className="text-xs text-slate-500">{lead.companyName}</div>
                                </td>
                                <td className="py-3">
                                    <span className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-semibold",
                                        lead.status === 'NEW' && "bg-slate-100 text-slate-600",
                                        lead.status === 'CONTACTED' && "bg-blue-100 text-blue-700",
                                        lead.status === 'REPLIED' && "bg-indigo-100 text-indigo-700",
                                        lead.status === 'INTERESTED' && "bg-emerald-100 text-emerald-700",
                                        lead.status === 'NOT_INTERESTED' && "bg-red-100 text-red-700",
                                        lead.status === 'ESCALATE' && "bg-amber-100 text-amber-700"
                                    )}>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-600">{lead.campaign?.name || 'N/A'}</td>
                                <td className="py-3 text-slate-500">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                                <td className="py-3">
                                    <button className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary-600 transition-all">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && leads.length === 0 && (
                    <div className="py-8 text-center text-slate-400">No leads found.</div>
                )}
            </div>
        </div>
    );
}
