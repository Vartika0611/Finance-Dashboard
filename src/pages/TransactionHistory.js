import React, { useState, useEffect } from 'react';
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const TransactionHistory = ({ transactions = [], darkMode }) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setFilteredTransactions(transactions);
      setIsLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    let result = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx =>
        tx.title.toLowerCase().includes(term) ||
        tx.category.toLowerCase().includes(term) ||
        tx.amount.toString().includes(term)
      );
    }

    if (filters.type !== 'all') result = result.filter(tx => tx.type === filters.type);
    if (filters.category !== 'all') result = result.filter(tx => tx.category === filters.category);
    if (filters.startDate) result = result.filter(tx => tx.date >= filters.startDate);
    if (filters.endDate) result = result.filter(tx => tx.date <= filters.endDate);

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const categories = [...new Set(transactions.map(tx => tx.category))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-primary-400' : 'border-primary-600'}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 mb-4 md:mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Transaction History
        </h1>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={`${darkMode ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            className={`input-field pl-10 w-full transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className={`card p-4 mb-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className={`input-field w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className={`input-field w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>From Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={`input-field w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>To Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={`input-field w-full transition-colors duration-300 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              min={filters.startDate}
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className={`card overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y transition-colors duration-300" >
            <thead className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                {['title','date','category','amount'].map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'} transition-colors duration-300`}
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center justify-between">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortConfig.key === key && (
                        sortConfig.direction === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${tx.type === 'income' ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;