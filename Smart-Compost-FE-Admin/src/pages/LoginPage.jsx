import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api, { endpoints } from '../services/api';
import compostImage from "../assets/compost.jpeg";
import logoImage from "../assets/react.svg";

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
    <div className="grid grid-cols-1 lg:grid-cols-4 h-screen w-screen">
      {/* Kolom 1 - Gambar (3/4 layar) */}
      <div
        className="hidden  lg:block lg:col-span-3 bg-cover bg-center bg-no-repeat relative"
        src={compostImage}
        alt="Compost Background"
         style={{ backgroundImage: `url(${compostImage})` }}
      >
      </div>

      {/* Kolom 2 - Form Login (1/4 layar) */}
      <div className="flex flex-col items-center justify-center p-8  rounded-lg shadow-lg ">

        {/* Logo */}
        <img
          src={logoImage}
          alt="Smart Compost Analyzer Logo"
          className="w-60 h-30 mb-8 object-contain"
        />

        {/* Header */}
        <div className="text-center text-black mb-8 px-4 max-w-lg">
          <h1 className="font-bold text-4xl sm:text-3xl mb-4">
            Welcome to Smart Compost Analyzer
          </h1>
          <p className="italic text-sm sm:text-base text-black leading-relaxed">
            "Track temperature, pH, moisture, and nutrient levels — ensuring your compost meets SNI standards.""
          </p>
        </div>

        {/* Form Login */}
        <div className="w-full max-w-sm">
          <div className="space-y-6">
            

            {/* Username */}
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
                placeholder="Enter your username or email"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password */}
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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
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
    </div>
  );
};

export default LoginPage;
