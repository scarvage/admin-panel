import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopMoversTab = () => {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTopMovers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://backend-kve8.onrender.com/api/stocks/top-movers');
      setTopGainers(response.data.topGainers);
      setTopLosers(response.data.topLosers);
    } catch (err) {
      setError('Failed to fetch top movers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshStocks = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.put('https://backend-kve8.onrender.com/api/stocks/refresh');
      await fetchTopMovers(); // Refresh data after successful update
    } catch (err) {
      setError('Failed to refresh stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopMovers();
  }, []);

  return (
    <div>
      

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-8">
        {/* Top Gainers Table */}
        <div>
          <h2 className="text-lg font-semibold text-green-600 mb-4">Top Gainers</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ticker</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Current Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Previous Close</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {loading && !topGainers.length ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                topGainers.map((gainer, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800">{gainer.ticker}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{gainer.current_price}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{gainer.previous_close}</td>
                    <td className="px-4 py-2 text-sm text-green-600">
                      {gainer.percentage_change.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Top Losers Table */}
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-4">Top Losers</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ticker</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Current Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Previous Close</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {loading && !topLosers.length ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : (
                topLosers.map((loser, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800">{loser.ticker}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{loser.current_price}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{loser.previous_close}</td>
                    <td className="px-4 py-2 text-sm text-red-600">
                      {loser.percentage_change.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopMoversTab;
