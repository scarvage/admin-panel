import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Layout/Navbar';
import SubscriptionsTab from './Tabs/SubscriptionsTab';
import ProductsTab from './Tabs/ProductsTab';
import BlogsTab from './Tabs/BlogsTab';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('subscriptions');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const renderTab = () => {
    switch(activeTab) {
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'products':
        return <ProductsTab />;
      case 'blogs':
        return <BlogsTab />;
      default:
        return <SubscriptionsTab />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'subscriptions', label: 'Subscriptions' },
              { key: 'products', label: 'Products' },
              { key: 'blogs', label: 'Blogs' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTab()}
      </div>
    </div>
  );
};

export default Dashboard;