import React, { useEffect, useState } from 'react';
import api from '../utils/api';

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Campaigns</h1>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)}>+ New Campaign</button>
            </div>

            {isCreating && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Create New Campaign</h2>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end' }}>
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
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Launch Hunter'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>{campaign.name}</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <span>Status: <span style={{ fontWeight: 500, color: campaign.status === 'ACTIVE' ? 'var(--success)' : 'var(--text)' }}>{campaign.status}</span></span>
                                <span>Leads: {campaign._count?.leads || 0}</span>
                            </div>
                        </div>
                        <div>
                            {campaign.status === 'DRAFT' && (
                                <button className="btn btn-primary" onClick={() => handleStart(campaign.id)}>Start Campaign</button>
                            )}
                            {campaign.status === 'ACTIVE' && (
                                <button className="btn btn-outline" disabled>Running...</button>
                            )}
                        </div>
                    </div>
                ))}
                {campaigns.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No campaigns yet. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
