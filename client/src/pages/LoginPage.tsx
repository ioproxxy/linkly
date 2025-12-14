import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const { data } = await api.post(endpoint, { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/');
        } catch (error) {
            alert('Authentication failed');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="card w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Linkly
                    </h1>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {isRegister ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        AI-Powered Outbound Sales Platform
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Email address</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3 text-base shadow-lg shadow-blue-500/30">
                        {isRegister ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="ml-1 font-medium text-primary-600 hover:text-primary-500"
                    >
                        {isRegister ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}
