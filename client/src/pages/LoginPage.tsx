import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        {isRegister ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 500, marginLeft: '0.25rem' }}
                    >
                        {isRegister ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}
