import React from 'react';

export default function DashboardPage() {
    // const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <div className="label" style={{ color: 'var(--text-muted)' }}>Total Leads Found</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>1,248</div>
                </div>
                <div className="card">
                    <div className="label" style={{ color: 'var(--text-muted)' }}>Emails Sent</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>856</div>
                </div>
                <div className="card">
                    <div className="label" style={{ color: 'var(--text-muted)' }}>Replies Received</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>42</div>
                </div>
                <div className="card">
                    <div className="label" style={{ color: 'var(--text-muted)' }}>Meetings Booked</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--success)' }}>12</div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>New Reply from Agency {i}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>"Interested, let's chat..."</div>
                            </div>
                            <span className="badge badge-green">Interested</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
