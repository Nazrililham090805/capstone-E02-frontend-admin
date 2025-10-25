import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DetailAnalysis from './pages/DetailAnalysis';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Jika belum login → hanya tampil LoginPage */}
        {!isLoggedIn ? (
          <Routes>
            <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
            {/* Redirect semua rute lain ke halaman login */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <AuthenticatedApp onLogout={() => setIsLoggedIn(false)} />
        )}
      </div>
    </Router>
  );
}

function AuthenticatedApp({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-9xl mx-auto px-6 py-3 flex justify-end items-center">
          

          <button
            onClick={() => {
              onLogout();
              navigate('/'); // kembali ke login
            }}
            className="px-8 py-2 bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Konten utama Ukuran Layar*/}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail" element={<DetailAnalysis />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
