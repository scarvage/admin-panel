import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import DetailsModal from '../Modals/DetailsModal';

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionDescription, setSubscriptionDescription] = useState('');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsResponse, prodsResponse] = await Promise.all([
        apiService.getSubscriptions(),
        apiService.getProducts()
      ]);
      setSubscriptions(subsResponse.data);
      setProducts(prodsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      await apiService.createSubscription({
        name: subscriptionName,
        description: subscriptionDescription
      });
      fetchData();
      setSubscriptionName('');
      setSubscriptionDescription('');
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleAddProductToSubscription = async () => {
    if (!selectedSubscriptionId || !selectedProductId) {
      alert('Please select both subscription and product');
      return;
    }

    try {
      await apiService.addProductToSubscription(
        selectedSubscriptionId, 
        selectedProductId
      );
      fetchData();
      setSelectedSubscriptionId('');
      setSelectedProductId('');
    } catch (error) {
      console.error('Error adding product to subscription:', error);
    }
  };

  const viewSubscriptionDetails = async (id) => {
    try {
      const response = await apiService.getSubscriptionDetails(id);
      setSelectedSubscription(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Create Subscription */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Create Subscription</h3>
        <form onSubmit={handleCreateSubscription} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={subscriptionName}
            onChange={(e) => setSubscriptionName(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={subscriptionDescription}
            onChange={(e) => setSubscriptionDescription(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>

      {/* Add Product to Subscription */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Add Product to Subscription</h3>
        <div className="flex space-x-4">
          <select 
            value={selectedSubscriptionId}
            onChange={(e) => setSelectedSubscriptionId(e.target.value)}
            className="w-1/2 p-2 border rounded"
          >
            <option value="">Select Subscription</option>
            {subscriptions.map(sub => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
          <select 
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-1/2 p-2 border rounded"
          >
            <option value="">Select Product</option>
            {products.map(prod => (
              <option key={prod._id} value={prod._id}>
                {prod.name}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddProductToSubscription}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">All Subscriptions</h3>
        <div className="space-y-4">
          {subscriptions.map(sub => (
            <div key={sub._id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{sub.name}</h4>
                <button 
                  onClick={() => viewSubscriptionDetails(sub._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-600">{sub.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Details Modal */}
      <DetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Subscription Details"
      >
        {selectedSubscription && (
          <div>
            <h4 className="text-xl font-medium mb-4">{selectedSubscription.name}</h4>
            <p className="mb-4">{selectedSubscription.description}</p>
            <div className="space-y-4">
              <h5 className="font-medium">Products:</h5>
              {selectedSubscription.products.map(product => (
                <div key={product._id} className="border p-4 rounded">
                  <h6 className="font-medium">{product.name}</h6>
                  <p>{product.description}</p>
                  <div className="mt-2">
                    <h6 className="font-medium">Funds:</h6>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {product.funds.map(fund => (
                        <div key={fund._id} className="border p-2 rounded">
                          <p className="font-medium">{fund.name}</p>
                          <p>Price: ₹{fund.price}</p>
                          <p>Allocation: {fund.allocationPercent}%</p>
                          <p>Entry Price: ₹{fund.entryPrice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailsModal>
    </div>
  );
};

export default SubscriptionsTab;