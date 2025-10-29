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
    const response = await api.post(endpoints.auth.login, {
      username: username,
      password: password
    });

    // Check both message and token from response
    if (response.data.message === "Login successful" && response.data.token) {
      // Store the JWT token
      localStorage.setItem('token', response.data.token);
      // Call the onLogin callback to update app state
      onLogin();
    }
  } catch (err) {
    alert(err.response?.data?.error || 'Login failed');
  }
};
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-3/4 relative">
        <img
          src="src\assets\compost1.jpg"
          alt="Composting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Smart Compost Analyzer Admin Dashboard 
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Track temperature, pH, moisture, and nutrient levels —<br />
              ensuring your compost meets national standards (SNI).
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Your Username or Email"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Your Password"
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

            
            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;