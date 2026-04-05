import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Initial mock data
const initialTransactions = [
  { id: 1, title: 'Grocery Shopping', amount: 125.75, category: 'Food', type: 'expense', date: '2025-08-05' },
  { id: 2, title: 'Freelance Work', amount: 1200.00, category: 'Salary', type: 'income', date: '2025-08-03' },
  { id: 3, title: 'Electric Bill', amount: 78.90, category: 'Utilities', type: 'expense', date: '2025-08-01' },
  { id: 4, title: 'New Laptop', amount: 899.99, category: 'Electronics', type: 'expense', date: '2025-08-02' },
  { id: 5, title: 'Restaurant Dinner', amount: 65.50, category: 'Food', type: 'expense', date: '2025-08-04' },
  { id: 6, title: 'Gym Membership', amount: 45.00, category: 'Health', type: 'expense', date: '2025-08-01' },
  { id: 7, title: 'Uber Rides', amount: 32.75, category: 'Transport', type: 'expense', date: '2025-08-06' },
  { id: 8, title: 'Salary', amount: 3200.00, category: 'Salary', type: 'income', date: '2025-07-30' },
  { id: 9, title: 'Rent Payment', amount: 1200.00, category: 'Housing', type: 'expense', date: '2025-07-28' },
  { id: 10, title: 'Internet Bill', amount: 64.99, category: 'Utilities', type: 'expense', date: '2025-07-25' },
  { id: 11, title: 'Supermarket', amount: 187.30, category: 'Food', type: 'expense', date: '2025-07-20' },
  { id: 12, title: 'Movie Night', amount: 28.50, category: 'Entertainment', type: 'expense', date: '2025-07-18' },
  { id: 13, title: 'Freelance Project', amount: 850.00, category: 'Salary', type: 'income', date: '2025-06-15' },
  { id: 14, title: 'Car Insurance', amount: 125.00, category: 'Transport', type: 'expense', date: '2025-06-10' },
  { id: 15, title: 'Dentist Visit', amount: 150.00, category: 'Healthcare', type: 'expense', date: '2025-06-05' },
  { id: 16, title: 'Amazon Purchase', amount: 89.99, category: 'Shopping', type: 'expense', date: '2025-06-01' },
];

// Load transactions from localStorage or use initial data
const loadTransactions = () => {
  try {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return initialTransactions;
  }
};

function App() {
  const [transactions, setTransactions] = useState(loadTransactions);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Persist dark mode and add/remove 'dark' class on <html>
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist transactions
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    setTransactions(prev => [
      { ...newTransaction, id: Date.now(), amount: parseFloat(newTransaction.amount) },
      ...prev
    ]);
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        {/* Navbar receives darkMode toggle */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard transactions={transactions} darkMode={darkMode} />} />
            <Route path="/add-transaction" element={<AddTransaction onAddTransaction={addTransaction} darkMode={darkMode} />} />
            <Route path="/transactions" element={<TransactionHistory transactions={transactions} darkMode={darkMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;