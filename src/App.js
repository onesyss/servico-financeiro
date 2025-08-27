import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Debts from './pages/Debts';
import FixedBills from './pages/FixedBills';
import Savings from './pages/Savings';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import AccountBalance from './pages/AccountBalance';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="debts" element={<Debts />} />
            <Route path="fixed-bills" element={<FixedBills />} />
            <Route path="savings" element={<Savings />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="account-balance" element={<AccountBalance />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;