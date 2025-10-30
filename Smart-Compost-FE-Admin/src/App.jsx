import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DetailAnalysis from './pages/DetailAnalysis';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6">Halaman tidak ditemukan.</p>
      <div className="space-x-3">
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">Kembali ke Dashboard</Link>
      </div>
    </div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
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

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <svg
        className="animate-spin h-12 w-12 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );

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
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
          />

          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <RequireAuth>
                <DetailAnalysis />
              </RequireAuth>
            }
          />

          {/* wildcard: kalau user tidak login -> redirect /login, kalau login -> tampilkan 404 */}
          <Route
            path="*"
            element={isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
