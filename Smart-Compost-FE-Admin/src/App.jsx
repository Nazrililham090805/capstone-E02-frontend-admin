import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DetailAnalysis from './pages/DetailAnalysis';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize auth state based on token existence
    return !!localStorage.getItem('token');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Bikin Loading Component inget
  }

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-9xl mx-auto px-6 py-3 flex justify-end items-center">
              <button
                onClick={handleLogout}
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-600 transition rounded"
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/detail/:id" 
            element={
              isAuthenticated ? 
                <DetailAnalysis /> : 
                <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

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
