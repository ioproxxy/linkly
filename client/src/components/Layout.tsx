import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
                    <div className="logo">Linkly</div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 500
                            }}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/campaigns"
                            style={{
                                textDecoration: 'none',
                                color: isActive('/campaigns') ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 500
                            }}
                        >
                            Campaigns
                        </Link>
                    </div>
                    <div>
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#e2e8f0' }}></div>
                    </div>
                </div>
            </nav>
            <main className="container" style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
