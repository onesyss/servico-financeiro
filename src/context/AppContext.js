import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

// Criar o contexto
const AppContext = createContext();

// Hook personalizado para usar o contexto
export const useAppContext = () => useContext(AppContext);

// Provedor do contexto
export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
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

  // Estado para contas bancárias
  const [bankAccounts, setBankAccounts] = useState(() => {
    const savedBankAccounts = localStorage.getItem('controlfin_bankAccounts');
    return savedBankAccounts ? JSON.parse(savedBankAccounts) : [];
  });

  // Estado para lançamentos financeiros
  const [financialEntries, setFinancialEntries] = useState(() => {
    const savedEntries = localStorage.getItem('controlfin_financialEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  // Estado para saldo em conta (mantido para compatibilidade)
  const [accountBalance, setAccountBalance] = useState(() => {
    const savedBalance = localStorage.getItem('controlfin_accountBalance');
    return savedBalance ? JSON.parse(savedBalance) : {
      currentBalance: 0,
      transactions: []
    };
  });

  // Estado para controle de sincronização
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Função para carregar dados do Firestore quando o usuário fizer login
  const loadUserData = async (userId) => {
    try {
      setIsLoading(true);
      console.log('Carregando dados do usuário:', userId);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dados encontrados no Firestore:', userData);
        
        // Sempre carregar dados do Firestore, sobrescrevendo dados locais
        if (userData.expenses && Array.isArray(userData.expenses)) {
          setExpenses(userData.expenses);
          localStorage.setItem('controlfin_expenses', JSON.stringify(userData.expenses));
          console.log('Expenses carregadas:', userData.expenses.length);
        }
        
        if (userData.debts && Array.isArray(userData.debts)) {
          setDebts(userData.debts);
          localStorage.setItem('controlfin_debts', JSON.stringify(userData.debts));
          console.log('Debts carregadas:', userData.debts.length);
        }
        
        if (userData.fixedBills && Array.isArray(userData.fixedBills)) {
          setFixedBills(userData.fixedBills);
          localStorage.setItem('controlfin_fixedBills', JSON.stringify(userData.fixedBills));
          console.log('FixedBills carregadas:', userData.fixedBills.length);
        }
        
        if (userData.savingsGoals && Array.isArray(userData.savingsGoals)) {
          setSavingsGoals(userData.savingsGoals);
          localStorage.setItem('controlfin_savingsGoals', JSON.stringify(userData.savingsGoals));
          console.log('SavingsGoals carregadas:', userData.savingsGoals.length);
        }
        
        if (userData.bankAccounts && Array.isArray(userData.bankAccounts)) {
          setBankAccounts(userData.bankAccounts);
          localStorage.setItem('controlfin_bankAccounts', JSON.stringify(userData.bankAccounts));
          console.log('BankAccounts carregadas:', userData.bankAccounts.length);
        }
        
        if (userData.financialEntries && Array.isArray(userData.financialEntries)) {
          setFinancialEntries(userData.financialEntries);
          localStorage.setItem('controlfin_financialEntries', JSON.stringify(userData.financialEntries));
          console.log('FinancialEntries carregadas:', userData.financialEntries.length);
        }
        
        if (userData.accountBalance) {
          setAccountBalance(userData.accountBalance);
          localStorage.setItem('controlfin_accountBalance', JSON.stringify(userData.accountBalance));
          console.log('AccountBalance carregado:', userData.accountBalance);
        }
        
        setLastSync(new Date());
        console.log('Dados carregados com sucesso do Firestore');
      } else {
        console.log('Nenhum documento encontrado para o usuário');
        // Se não existir documento, criar um inicial
        await setDoc(doc(db, 'users', userId), {
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          expenses: [],
          debts: [],
          fixedBills: [],
          savingsGoals: [],
          bankAccounts: [],
          financialEntries: [],
          accountBalance: {
            currentBalance: 0,
            transactions: []
          },
          createdAt: new Date(),
          lastUpdated: new Date()
        });
        console.log('Documento inicial criado para o usuário');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar dados no Firestore
  const saveUserData = async (dataType, data) => {
    if (!currentUser) {
      console.log('Usuário não logado, não salvando no Firestore');
      return;
    }
    
    try {
      console.log(`Salvando ${dataType} no Firestore:`, data);
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Verificar se o documento existe
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Atualizar documento existente
        await updateDoc(userRef, {
          [dataType]: data,
          lastUpdated: new Date()
        });
        console.log(`${dataType} atualizado com sucesso no Firestore`);
      } else {
        // Criar documento se não existir
        await setDoc(userRef, {
          name: currentUser?.displayName || '',
          email: currentUser?.email || '',
          [dataType]: data,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
        console.log(`Documento criado e ${dataType} salvo com sucesso no Firestore`);
      }
      
      setLastSync(new Date());
    } catch (error) {
      console.error(`Erro ao salvar ${dataType} no Firestore:`, error);
    }
  };

  // Carregar dados quando o usuário fizer login
  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser.uid);
      
      // Configurar listener em tempo real para sincronização automática
      const userRef = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          console.log('Dados atualizados em tempo real:', userData);
          
          // Atualizar estados apenas se os dados forem diferentes
          if (userData.expenses && Array.isArray(userData.expenses)) {
            setExpenses(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.expenses)) {
                localStorage.setItem('controlfin_expenses', JSON.stringify(userData.expenses));
                return userData.expenses;
              }
              return prev;
            });
          }
          
          if (userData.debts && Array.isArray(userData.debts)) {
            setDebts(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.debts)) {
                localStorage.setItem('controlfin_debts', JSON.stringify(userData.debts));
                return userData.debts;
              }
              return prev;
            });
          }
          
          if (userData.fixedBills && Array.isArray(userData.fixedBills)) {
            setFixedBills(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.fixedBills)) {
                localStorage.setItem('controlfin_fixedBills', JSON.stringify(userData.fixedBills));
                return userData.fixedBills;
              }
              return prev;
            });
          }
          
          if (userData.savingsGoals && Array.isArray(userData.savingsGoals)) {
            setSavingsGoals(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.savingsGoals)) {
                localStorage.setItem('controlfin_savingsGoals', JSON.stringify(userData.savingsGoals));
                return userData.savingsGoals;
              }
              return prev;
            });
          }
          
          if (userData.bankAccounts && Array.isArray(userData.bankAccounts)) {
            setBankAccounts(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.bankAccounts)) {
                localStorage.setItem('controlfin_bankAccounts', JSON.stringify(userData.bankAccounts));
                return userData.bankAccounts;
              }
              return prev;
            });
          }
          
          if (userData.financialEntries && Array.isArray(userData.financialEntries)) {
            setFinancialEntries(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.financialEntries)) {
                localStorage.setItem('controlfin_financialEntries', JSON.stringify(userData.financialEntries));
                return userData.financialEntries;
              }
              return prev;
            });
          }
          
          if (userData.accountBalance) {
            setAccountBalance(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(userData.accountBalance)) {
                localStorage.setItem('controlfin_accountBalance', JSON.stringify(userData.accountBalance));
                return userData.accountBalance;
              }
              return prev;
            });
          }
          
          setLastSync(new Date());
        }
      }, (error) => {
        console.error('Erro no listener em tempo real:', error);
      });
      
      // Cleanup do listener quando o componente for desmontado
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  // Salvar dados no localStorage e Firestore quando o estado mudar
  useEffect(() => {
    localStorage.setItem('controlfin_expenses', JSON.stringify(expenses));
    if (currentUser) {
      saveUserData('expenses', expenses);
    }
  }, [expenses, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_debts', JSON.stringify(debts));
    if (currentUser) {
      saveUserData('debts', debts);
    }
  }, [debts, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_fixedBills', JSON.stringify(fixedBills));
    if (currentUser) {
      saveUserData('fixedBills', fixedBills);
    }
  }, [fixedBills, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_savingsGoals', JSON.stringify(savingsGoals));
    if (currentUser) {
      saveUserData('savingsGoals', savingsGoals);
    }
  }, [savingsGoals, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_bankAccounts', JSON.stringify(bankAccounts));
    if (currentUser) {
      saveUserData('bankAccounts', bankAccounts);
    }
  }, [bankAccounts, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_financialEntries', JSON.stringify(financialEntries));
    if (currentUser) {
      saveUserData('financialEntries', financialEntries);
    }
  }, [financialEntries, currentUser]);

  useEffect(() => {
    localStorage.setItem('controlfin_accountBalance', JSON.stringify(accountBalance));
    if (currentUser) {
      saveUserData('accountBalance', accountBalance);
    }
  }, [accountBalance, currentUser]);

  // Funções para manipular contas bancárias
  const addBankAccount = (account) => {
    const id = bankAccounts.length > 0 ? Math.max(...bankAccounts.map(a => a.id)) + 1 : 1;
    const newAccount = { 
      ...account, 
      id, 
      balance: parseFloat(account.balance) || 0,
      isDefault: bankAccounts.length === 0 // Primeira conta é padrão
    };
    setBankAccounts([...bankAccounts, newAccount]);
  };

  const updateBankAccount = (id, updatedAccount) => {
    setBankAccounts(bankAccounts.map(account => 
      account.id === id ? { ...updatedAccount, id, balance: parseFloat(updatedAccount.balance) || 0 } : account
    ));
  };

  const deleteBankAccount = (id) => {
    const accountToDelete = bankAccounts.find(account => account.id === id);
    if (accountToDelete && accountToDelete.isDefault && bankAccounts.length > 1) {
      // Se for a conta padrão e houver outras contas, tornar a próxima como padrão
      const remainingAccounts = bankAccounts.filter(account => account.id !== id);
      const newDefaultAccount = remainingAccounts[0];
      setBankAccounts(remainingAccounts.map(account => 
        account.id === newDefaultAccount.id ? { ...account, isDefault: true } : account
      ));
    } else {
      setBankAccounts(bankAccounts.filter(account => account.id !== id));
    }
  };

  const setDefaultBankAccount = (id) => {
    setBankAccounts(bankAccounts.map(account => ({
      ...account,
      isDefault: account.id === id
    })));
  };

  const updateBankAccountBalance = (id, amount) => {
    setBankAccounts(bankAccounts.map(account => 
      account.id === id ? { ...account, balance: account.balance + parseFloat(amount) } : account
    ));
  };

  const getDefaultBankAccount = () => {
    return bankAccounts.find(account => account.isDefault) || bankAccounts[0];
  };

  const getTotalBankBalance = () => {
    return bankAccounts.reduce((total, account) => total + account.balance, 0);
  };

  // Funções para manipular lançamentos financeiros
  const addFinancialEntry = (entry) => {
    const id = financialEntries.length > 0 ? Math.max(...financialEntries.map(e => e.id)) + 1 : 1;
    const newEntry = {
      ...entry,
      id,
      isPaid: false,
      createdAt: new Date().toISOString(),
      installments: entry.isRecurring ? entry.installments || 1 : 1,
      currentInstallment: 1
    };

    // Se for parcelado, criar múltiplos lançamentos
    if (entry.isRecurring && entry.installments > 1) {
      const entries = [];
      for (let i = 0; i < entry.installments; i++) {
        const installmentEntry = {
          ...newEntry,
          id: id + i,
          currentInstallment: i + 1,
          totalInstallments: entry.installments,
          dueDate: (() => {
            const date = new Date(entry.dueDate);
            date.setMonth(date.getMonth() + i);
            return date.toISOString().split('T')[0];
          })()
        };
        entries.push(installmentEntry);
      }
      setFinancialEntries([...financialEntries, ...entries]);
    } else {
      setFinancialEntries([...financialEntries, newEntry]);
    }
  };

  const updateFinancialEntry = (id, updatedEntry) => {
    setFinancialEntries(financialEntries.map(entry => 
      entry.id === id ? { ...updatedEntry, id } : entry
    ));
  };

  const deleteFinancialEntry = (id) => {
    setFinancialEntries(financialEntries.filter(entry => entry.id !== id));
  };

  const toggleFinancialEntryPaid = (id) => {
    setFinancialEntries(financialEntries.map(entry => {
      if (entry.id === id) {
        const wasPaid = entry.isPaid;
        const newEntry = { ...entry, isPaid: !wasPaid };
        
        // Se está marcando como pago, desconta da conta bancária
        if (!wasPaid && entry.bankAccountId && entry.bankAccountId !== 'cash') {
          updateBankAccountBalance(entry.bankAccountId, -parseFloat(entry.amount));
        }
        // Se está desmarcando como pago, adiciona de volta à conta bancária
        else if (wasPaid && entry.bankAccountId && entry.bankAccountId !== 'cash') {
          updateBankAccountBalance(entry.bankAccountId, parseFloat(entry.amount));
        }
        
        return newEntry;
      }
      return entry;
    }));
  };

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

  // Funções para manipular saldo em conta (atualizadas para usar contas bancárias)
  const addTransaction = (transaction) => {
    const id = accountBalance.transactions.length > 0 
      ? Math.max(...accountBalance.transactions.map(t => t.id)) + 1 
      : 1;
    
    const newTransaction = { ...transaction, id, date: new Date().toISOString() };
    const amount = parseFloat(transaction.amount);
    
    // Atualizar saldo da conta bancária selecionada
    if (transaction.bankAccountId) {
      updateBankAccountBalance(transaction.bankAccountId, amount);
    }
    
    setAccountBalance(prev => ({
      currentBalance: prev.currentBalance + amount,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const updateTransaction = (id, updatedTransaction) => {
    setAccountBalance(prev => {
      const oldTransaction = prev.transactions.find(t => t.id === id);
      const oldAmount = parseFloat(oldTransaction.amount);
      const newAmount = parseFloat(updatedTransaction.amount);
      
      // Reverter mudança na conta bancária antiga
      if (oldTransaction.bankAccountId) {
        updateBankAccountBalance(oldTransaction.bankAccountId, -oldAmount);
      }
      
      // Aplicar mudança na nova conta bancária
      if (updatedTransaction.bankAccountId) {
        updateBankAccountBalance(updatedTransaction.bankAccountId, newAmount);
      }
      
      return {
        currentBalance: prev.currentBalance - oldAmount + newAmount,
        transactions: prev.transactions.map(transaction => 
          transaction.id === id ? { ...updatedTransaction, id } : transaction
        )
      };
    });
  };

  const deleteTransaction = (id) => {
    setAccountBalance(prev => {
      const transaction = prev.transactions.find(t => t.id === id);
      const amount = parseFloat(transaction.amount);
      
      // Reverter mudança na conta bancária
      if (transaction.bankAccountId) {
        updateBankAccountBalance(transaction.bankAccountId, -amount);
      }
      
      return {
        currentBalance: prev.currentBalance - amount,
        transactions: prev.transactions.filter(transaction => transaction.id !== id)
      };
    });
  };

  const setInitialBalance = (balance) => {
    setAccountBalance(prev => ({
      ...prev,
      currentBalance: parseFloat(balance)
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

    const financialEntriesForDate = financialEntries
      .filter(entry => entry.dueDate === dateString)
      .map(entry => ({ ...entry, type: 'financial' }));

    return [...fixedBillsForDate, ...debtsForDate, ...financialEntriesForDate];
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

    const overdueFinancialEntries = financialEntries
      .filter(entry => !entry.isPaid && new Date(entry.dueDate) < today)
      .map(entry => ({ ...entry, type: 'financial' }));

    return [...overdueFixedBills, ...overdueDebts, ...overdueFinancialEntries];
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

    const upcomingFinancialEntries = financialEntries
      .filter(entry => !entry.isPaid && new Date(entry.dueDate) >= today && new Date(entry.dueDate) <= futureDate)
      .map(entry => ({ ...entry, type: 'financial' }));

    return [...upcomingFixedBills, ...upcomingDebts, ...upcomingFinancialEntries];
  };

  // Valor fornecido pelo contexto
  const value = {
    expenses,
    debts,
    fixedBills,
    savingsGoals,
    accountBalance,
    bankAccounts,
    financialEntries,
    isLoading,
    lastSync,
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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setInitialBalance,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    updateBankAccountBalance,
    getDefaultBankAccount,
    getTotalBankBalance,
    addFinancialEntry,
    updateFinancialEntry,
    deleteFinancialEntry,
    toggleFinancialEntryPaid,
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