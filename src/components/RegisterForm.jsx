import { useState } from 'react';
import { registerUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { useNavigate } from '@tanstack/react-router';

const RegisterForm = ({state}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();    
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');

    console.log('📝 Attempting registration with:', { name, email, password: '***' });

    try {
      const data = await registerUser(name, password, email);
      console.log('✅ Registration response:', data);

      if (data && data.user) {
        // Store token in localStorage for production compatibility
        if (data.token) {
          localStorage.setItem('accessToken', data.token);
          console.log('💾 Token stored in localStorage');
        }

        dispatch(login(data.user))
        navigate({to:"/dashboard"})
        console.log("✅ Registration success, navigating to dashboard")
      } else {
        setError('Registration successful but no user data received');
      }
      setLoading(false);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl px-8 pt-8 pb-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">✨ Create Account</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">
            👤 Full Name
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
            📧 Email Address
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
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
            className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white placeholder-gray-400"
            id="password"
            type="password"
            placeholder="Create a secure password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>


        <div className="mb-6">
          <button
            className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '🔄 Creating Account...' : '🎉 Create Account'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?
            <button
              onClick={()=>state(true)}
              className="ml-1 text-purple-400 hover:text-cyan-400 font-semibold transition-colors duration-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;