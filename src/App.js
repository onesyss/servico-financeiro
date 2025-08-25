import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Debts from './pages/Debts';
import FixedBills from './pages/FixedBills';
import Savings from './pages/Savings';
import Layout from './components/Layout';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="debts" element={<Debts />} />
          <Route path="fixed-bills" element={<FixedBills />} />
          <Route path="savings" element={<Savings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;