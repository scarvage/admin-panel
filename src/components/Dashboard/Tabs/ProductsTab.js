import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import DetailsModal from '../Modals/DetailsModal';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Product creation state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  // Add fund state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [fundCompanyName, setFundCompanyName] = useState('');
  const [fundAllocationPercent, setFundAllocationPercent] = useState('');
  const [fundEntryPrice, setFundEntryPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await apiService.createProduct({
        name: productName,
        description: productDescription
      });
      fetchProducts();
      // Reset form
      setProductName('');
      setProductDescription('');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleAddFund = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Please select a product');
      return;
    }

    try {
      await apiService.addFundToProduct(selectedProductId, {
        companyName: fundCompanyName,
        allocationPercent: parseInt(fundAllocationPercent),
        entryPrice: parseFloat(fundEntryPrice)
      });
      fetchProducts();
      // Reset form
      setSelectedProductId('');
      setFundCompanyName('');
      setFundAllocationPercent('');
      setFundEntryPrice('');
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  };

  const viewProductDetails = async (id) => {
    try {
      const response = await apiService.getProductDetails(id);
      setSelectedProduct(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Create Product */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Create Product</h3>
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
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

      {/* Add Fund to Product */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Add Fund to Product</h3>
        <form onSubmit={handleAddFund} className="space-y-4">
          <select 
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Product</option>
            {products.map(prod => (
              <option key={prod._id} value={prod._id}>
                {prod.name}
              </option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Company Name" 
            value={fundCompanyName}
            onChange={(e) => setFundCompanyName(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="number" 
            placeholder="Allocation Percent" 
            value={fundAllocationPercent}
            onChange={(e) => setFundAllocationPercent(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <input 
            type="number" 
            placeholder="Entry Price" 
            value={fundEntryPrice}
            onChange={(e) => setFundEntryPrice(e.target.value)}
            className="w-full p-2 border rounded" 
            required 
          />
          <button 
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Fund
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">All Products</h3>
        <div className="space-y-4">
          {products.map(prod => (
            <div key={prod._id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{prod.name}</h4>
                <button 
                  onClick={() => viewProductDetails(prod._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
              </div>
              <p className="text-gray-600">{prod.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      <DetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Product Details"
      >
        {selectedProduct && (
          <div>
            <h4 className="text-xl font-medium mb-4">{selectedProduct.name}</h4>
            <p className="mb-4">{selectedProduct.description}</p>
            <div className="space-y-4">
              <h5 className="font-medium">Funds:</h5>
              {selectedProduct.funds && selectedProduct.funds.length > 0 ? (
                selectedProduct.funds.map(fund => (
                  <div key={fund._id} className="border p-4 rounded">
                    <p className="font-medium">{fund.name}</p>
                    <p>Price: ₹{fund.price}</p>
                    <p>Allocation: {fund.allocationPercent}%</p>
                    <p>Entry Price: ₹{fund.entryPrice}</p>
                  </div>
                ))
              ) : (
                <p>No funds added yet</p>
              )}
            </div>
          </div>
        )}
      </DetailsModal>
    </div>
  );
};

export default ProductsTab;