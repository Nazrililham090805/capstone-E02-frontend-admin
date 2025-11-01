import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api, { endpoints } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await api.post(endpoints.auth.login, { username, password });
      if (response.data.message === 'Login successful' && response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/public/soil.jpg')" }}
    >
      {/* Overlay untuk kontras */}
      <div className="absolute inset-0 bg-black/20 backdrop-sm"></div>

      {/* Header*/}
      <div className="relative z-10 text-center text-black mb-8 px-4 -mt-60">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap">
          Welcome to Smart Compost Analyzer Dashboard
        </h1>
        <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Track temperature, pH, moisture, and nutrient levels — ensuring your compost meets national standards (SNI).
        </p>
      </div>

      {/* Form Login */}
      <div className="relative z-10 w-full max-w-md p-8 bg-cover rounded-xl">
        <div className="space-y-5 mt-20">

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl text-center lg:text-4xl font-bold">
            Sign In
          </h1>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username or email"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Tombol Sign In */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
