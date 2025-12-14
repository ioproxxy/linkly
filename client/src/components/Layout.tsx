import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Linkly
                    </div>
                    <div className="flex gap-8">
                        <Link
                            to="/"
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-primary-600",
                                isActive('/') ? "text-primary-600" : "text-slate-500"
                            )}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/campaigns"
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-primary-600",
                                isActive('/campaigns') ? "text-primary-600" : "text-slate-500"
                            )}
                        >
                            Campaigns
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                        >
                            Logout
                        </button>
                        {/* Abstract Avatar */}
                        <div className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
                            U
                        </div>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8 flex-1">
                <Outlet />
            </main>
        </div>
    );
}
