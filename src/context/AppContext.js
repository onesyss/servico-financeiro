import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const AppContext = createContext();

// Hook personalizado para usar o contexto
export const useAppContext = () => useContext(AppContext);

// Provedor do contexto
export const AppProvider = ({ children }) => {
  // Estado para despesas
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('controlfin_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  // Estado para dívidas
  const [debts, setDebts] = useState(() => {
    const savedDebts = localStorage.getItem('controlfin_debts');
    return savedDebts ? JSON.parse(savedDebts) : [];
  });

  // Estado para contas fixas
  const [fixedBills, setFixedBills] = useState(() => {
    const savedFixedBills = localStorage.getItem('controlfin_fixedBills');
    return savedFixedBills ? JSON.parse(savedFixedBills) : [];
  });

  // Estado para metas de economia
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const savedSavingsGoals = localStorage.getItem('controlfin_savingsGoals');
    return savedSavingsGoals ? JSON.parse(savedSavingsGoals) : [];
  });

  // Salvar dados no localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('controlfin_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('controlfin_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('controlfin_fixedBills', JSON.stringify(fixedBills));
  }, [fixedBills]);

  useEffect(() => {
    localStorage.setItem('controlfin_savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  // Funções para manipular despesas
  const addExpense = (expense) => {
    const id = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    setExpenses([...expenses, { ...expense, id }]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...updatedExpense, id } : expense
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Funções para manipular dívidas
  const addDebt = (debt) => {
    const id = debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1;
    setDebts([...debts, { ...debt, id, isPaid: false }]);
  };

  const updateDebt = (id, updatedDebt) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...updatedDebt, id } : debt
    ));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  // Funções para manipular contas fixas
  const addFixedBill = (bill) => {
    const id = fixedBills.length > 0 ? Math.max(...fixedBills.map(b => b.id)) + 1 : 1;
    setFixedBills([...fixedBills, { ...bill, id, isPaid: false }]);
  };

  const updateFixedBill = (id, updatedBill) => {
    setFixedBills(fixedBills.map(bill => 
      bill.id === id ? { ...updatedBill, id } : bill
    ));
  };

  const deleteFixedBill = (id) => {
    setFixedBills(fixedBills.filter(bill => bill.id !== id));
  };

  const toggleFixedBillPaid = (id) => {
    setFixedBills(fixedBills.map(bill => 
      bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
    ));
  };

  // Funções para manipular metas de economia
  const addSavingsGoal = (goal) => {
    const id = savingsGoals.length > 0 ? Math.max(...savingsGoals.map(g => g.id)) + 1 : 1;
    setSavingsGoals([...savingsGoals, { ...goal, id }]);
  };

  const updateSavingsGoal = (id, updatedGoal) => {
    setSavingsGoals(savingsGoals.map(goal => 
      goal.id === id ? { ...updatedGoal, id } : goal
    ));
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  const addAmountToSavingsGoal = (id, amount) => {
    setSavingsGoals(savingsGoals.map(goal => {
      if (goal.id === id) {
        const newAmount = parseFloat(goal.currentAmount) + parseFloat(amount);
        return { 
          ...goal, 
          currentAmount: newAmount > goal.targetAmount ? goal.targetAmount : newAmount 
        };
      }
      return goal;
    }));
  };

  // Funções para cálculos e análises
  const calculateTotalExpenses = (month, year) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === parseInt(month) && 
          expenseDate.getFullYear() === parseInt(year)
        );
      })
      .reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const calculateTotalDebts = () => {
    return debts.reduce((total, debt) => total + parseFloat(debt.remainingAmount), 0);
  };

  const calculateTotalFixedBills = () => {
    return fixedBills.reduce((total, bill) => total + parseFloat(bill.amount), 0);
  };

  const calculateTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + parseFloat(goal.currentAmount), 0);
  };

  const getExpensesByCategory = (month, year) => {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() + 1 === parseInt(month) && 
        expenseDate.getFullYear() === parseInt(year)
      );
    });

    const categories = {};
    
    filteredExpenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += parseFloat(expense.amount);
    });

    return categories;
  };

  // Funções específicas para o calendário
  const getBillsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    const fixedBillsForDate = fixedBills
      .filter(bill => bill.dueDate === dateString)
      .map(bill => ({ ...bill, type: 'fixed' }));
    
    const debtsForDate = debts
      .filter(debt => debt.dueDate === dateString)
      .map(debt => ({ ...debt, type: 'debt' }));

    return [...fixedBillsForDate, ...debtsForDate];
  };

  const getOverdueBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueFixedBills = fixedBills
      .filter(bill => !bill.isPaid && new Date(bill.dueDate) < today)
      .map(bill => ({ ...bill, type: 'fixed' }));
    
    const overdueDebts = debts
      .filter(debt => !debt.isPaid && new Date(debt.dueDate) < today)
      .map(debt => ({ ...debt, type: 'debt' }));

    return [...overdueFixedBills, ...overdueDebts];
  };

  const getUpcomingBills = (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const upcomingFixedBills = fixedBills
      .filter(bill => !bill.isPaid && new Date(bill.dueDate) >= today && new Date(bill.dueDate) <= futureDate)
      .map(bill => ({ ...bill, type: 'fixed' }));
    
    const upcomingDebts = debts
      .filter(debt => !debt.isPaid && new Date(debt.dueDate) >= today && new Date(debt.dueDate) <= futureDate)
      .map(debt => ({ ...debt, type: 'debt' }));

    return [...upcomingFixedBills, ...upcomingDebts];
  };

  // Valor fornecido pelo contexto
  const value = {
    expenses,
    debts,
    fixedBills,
    savingsGoals,
    addExpense,
    updateExpense,
    deleteExpense,
    addDebt,
    updateDebt,
    deleteDebt,
    addFixedBill,
    updateFixedBill,
    deleteFixedBill,
    toggleFixedBillPaid,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addAmountToSavingsGoal,
    calculateTotalExpenses,
    calculateTotalDebts,
    calculateTotalFixedBills,
    calculateTotalSavings,
    getExpensesByCategory,
    getBillsForDate,
    getOverdueBills,
    getUpcomingBills
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};