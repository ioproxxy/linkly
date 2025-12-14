import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import clsx from 'clsx';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: '', industry: '', location: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns');
            setCampaigns(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/campaigns', formData);
            setIsCreating(false);
            fetchCampaigns();
            setFormData({ name: '', industry: '', location: '' });
        } catch (error) {
            alert('Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async (id: string) => {
        try {
            await api.post(`/campaigns/${id}/start`);
            alert('Campaign started!');
            fetchCampaigns();
        } catch (error) {
            alert('Error starting campaign');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
                    <p className="text-slate-500 mt-1">Manage your outreach campaigns.</p>
                </div>
                <button className="btn btn-primary shadow-lg shadow-blue-500/30" onClick={() => setIsCreating(true)}>+ New Campaign</button>
            </div>

            {isCreating && (
                <div className="card mb-8 border-l-4 border-l-primary-500">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Create New Campaign</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                            <label className="label">Campaign Name</label>
                            <input required className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Q1 Outreach" />
                        </div>
                        <div>
                            <label className="label">Target Industry</label>
                            <input required className="input" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} placeholder="e.g. SaaS" />
                        </div>
                        <div>
                            <label className="label">Location</label>
                            <input required className="input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. US, UK" />
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3">
                            <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Creating...' : 'Launch Hunter'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="card flex items-center justify-between hover:border-primary-200 transition-colors">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600">{campaign.name}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1">
                                    Status:
                                    <span className={clsx(
                                        "font-medium px-2 py-0.5 rounded-full text-xs",
                                        campaign.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                                    )}>{campaign.status}</span>
                                </span>
                                <span>Leads: {campaign._count?.leads || 0}</span>
                            </div>
                        </div>
                        <div>
                            {campaign.status === 'DRAFT' && (
                                <button className="btn btn-primary btn-sm" onClick={() => handleStart(campaign.id)}>Start Campaign</button>
                            )}
                            {campaign.status === 'ACTIVE' && (
                                <button className="btn btn-outline btn-sm opacity-75" disabled>Active</button>
                            )}
                        </div>
                    </div>
                ))}
                {campaigns.length === 0 && !loading && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="text-slate-400 mb-2">No campaigns yet</div>
                        <button className="btn btn-outline" onClick={() => setIsCreating(true)}>Create your first campaign</button>
                    </div>
                )}
            </div>
        </div>
    );
}
