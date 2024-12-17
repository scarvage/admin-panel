import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;