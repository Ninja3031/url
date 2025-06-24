import { useState } from 'react';
import { loginUser } from '../api/user.api';
import {useDispatch, useSelector} from 'react-redux';
import { login } from '../store/slice/authSlice.js';
import { useNavigate } from '@tanstack/react-router';

const LoginForm = ({ state }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    console.log(auth)

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        console.log('🔐 Attempting login with:', { email, password: '***' });

        try {
            const data = await loginUser(password, email);
            console.log('✅ Login response:', data);

            if (data && data.user) {
                // Store token in localStorage for production compatibility
                if (data.token) {
                    localStorage.setItem('accessToken', data.token);
                    console.log('💾 Token stored in localStorage');
                }

                dispatch(login(data.user))
                navigate({to:"/dashboard"})
                console.log("✅ Login success, navigating to dashboard")
            } else {
                setError('Login successful but no user data received');
            }
            setLoading(false);
        } catch (err) {
            console.error('❌ Login error:', err);
            setLoading(false);
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="w-full mx-auto">
            <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl px-8 pt-8 pb-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">🔐 Sign In</h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-xl">
                        <div className="flex items-center">
                            <span className="text-red-400 mr-2">⚠️</span>
                            {error}
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                        📧 Email Address
                    </label>
                    <input
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
                        🔒 Password
                    </label>
                    <input
                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <button
                        className={`w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? '🔄 Signing in...' : '🚀 Sign In'}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?
                        <button
                            onClick={() => state(false)}
                            className="ml-1 text-cyan-400 hover:text-purple-400 font-semibold transition-colors duration-300"
                        >
                            Create one here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;