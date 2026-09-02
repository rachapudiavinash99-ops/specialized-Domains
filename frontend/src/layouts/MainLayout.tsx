import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-indigo-700">
          Attendance System
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                User Management
              </Link>
              <Link to="/academic" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
                Academic setup
              </Link>
            </>
          )}
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <Link to="/attendance" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              Mark Attendance
            </Link>
          )}
          <Link to="/reports" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
            Reports
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <div className="mb-2 text-sm">{user?.email}</div>
          <button 
            onClick={handleLogout}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{user?.role} Portal</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
