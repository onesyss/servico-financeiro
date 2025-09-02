import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

// Estado inicial
const initialState = {
  expenses: [],
  debts: [],
  fixedBills: [],
  savings: [],
  bankAccounts: [],
  newExpense: {
    description: '',
    amount: '',
    date: '',
    category: '',
    account: '',
    type: 'expense'
  },
  newDebt: {
    description: '',
    amount: '',
    dueDate: '',
    creditor: '',
    account: '',
    isPaid: false
  },
  newFixedBill: {
    description: '',
    amount: '',
    dueDay: '',
    category: '',
    account: '',
    isPaid: false
  },
  newSaving: {
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    account: ''
  },
  newBankAccount: {
    name: '',
    balance: '',
    type: 'bank',
    color: '#3B82F6',
    institution: ''
  },
  selectedAccount: '',
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear()
};

// Reducer para gerenciar o estado
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_DEBTS':
      return { ...state, debts: action.payload };
    case 'SET_FIXED_BILLS':
      return { ...state, fixedBills: action.payload };
    case 'SET_SAVINGS':
      return { ...state, savings: action.payload };
    case 'SET_BANK_ACCOUNTS':
      return { ...state, bankAccounts: action.payload };
    case 'SET_NEW_EXPENSE':
      return { ...state, newExpense: action.payload };
    case 'SET_NEW_DEBT':
      return { ...state, newDebt: action.payload };
    case 'SET_NEW_FIXED_BILL':
      return { ...state, newFixedBill: action.payload };
    case 'SET_NEW_SAVING':
      return { ...state, newSaving: action.payload };
    case 'SET_NEW_BANK_ACCOUNT':
      return { ...state, newBankAccount: action.payload };
    case 'SET_SELECTED_ACCOUNT':
      return { ...state, selectedAccount: action.payload };
    case 'SET_SELECTED_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SET_SELECTED_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'RESET_NEW_EXPENSE':
      return { ...state, newExpense: initialState.newExpense };
    case 'RESET_NEW_DEBT':
      return { ...state, newDebt: initialState.newDebt };
    case 'RESET_NEW_FIXED_BILL':
      return { ...state, newFixedBill: initialState.newFixedBill };
    case 'RESET_NEW_SAVING':
      return { ...state, newSaving: initialState.newSaving };
    case 'RESET_NEW_BANK_ACCOUNT':
      return { ...state, newBankAccount: initialState.newBankAccount };
    default:
      return state;
  }
}

// Provider do contexto
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser } = useAuth();

  // Carregar dados do localStorage quando o usuário fizer login
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      
      // Carregar dados do localStorage
      const loadLocalData = () => {
        try {
          const localExpenses = JSON.parse(localStorage.getItem(`expenses_${userId}`)) || [];
          const localDebts = JSON.parse(localStorage.getItem(`debts_${userId}`)) || [];
          const localFixedBills = JSON.parse(localStorage.getItem(`fixedBills_${userId}`)) || [];
          const localSavings = JSON.parse(localStorage.getItem(`savings_${userId}`)) || [];
          const localBankAccounts = JSON.parse(localStorage.getItem(`bankAccounts_${userId}`)) || [];
          const localSelectedAccount = localStorage.getItem(`selectedAccount_${userId}`) || '';

          dispatch({ type: 'SET_EXPENSES', payload: localExpenses });
          dispatch({ type: 'SET_DEBTS', payload: localDebts });
          dispatch({ type: 'SET_FIXED_BILLS', payload: localFixedBills });
          dispatch({ type: 'SET_SAVINGS', payload: localSavings });
          dispatch({ type: 'SET_BANK_ACCOUNTS', payload: localBankAccounts });
          dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: localSelectedAccount });
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
        }
      };

      loadLocalData();
    }
  }, [currentUser]);

  // Salvar dados no localStorage sempre que houver mudanças
  const saveToLocalStorage = (key, data) => {
    if (currentUser) {
      try {
        localStorage.setItem(`${key}_${currentUser.uid}`, JSON.stringify(data));
      } catch (error) {
        console.error(`Erro ao salvar ${key} no localStorage:`, error);
      }
    }
  };

  // Funções para gerenciar despesas
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedExpenses = [...state.expenses, newExpense];
    dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
    saveToLocalStorage('expenses', updatedExpenses);
  };

  const updateExpense = (id, updates) => {
    const oldExpense = state.expenses.find(expense => expense.id === id);
    const updatedExpenses = state.expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
    saveToLocalStorage('expenses', updatedExpenses);

    // Atualizar o saldo da conta bancária apenas se mudou a conta ou o valor
    if (oldExpense && updates) {
      // Se mudou a conta bancária
      if (updates.bankAccountId && updates.bankAccountId !== oldExpense.bankAccountId) {
        // Reverter saldo da conta antiga (se estava pago)
        if (oldExpense.bankAccountId && oldExpense.bankAccountId !== 'cash' && oldExpense.isPaid) {
          const oldAccount = state.bankAccounts.find(a => a.id === oldExpense.bankAccountId);
          if (oldAccount) {
            const oldBalance = parseFloat(oldAccount.balance || 0);
            
            // Calcular o valor a ser restaurado
            let oldAmountToProcess;
            if (oldExpense.isRecurring && oldExpense.installments > 1) {
              const totalOldAmount = parseFloat(oldExpense.amount || 0);
              oldAmountToProcess = totalOldAmount / oldExpense.installments;
            } else {
              oldAmountToProcess = parseFloat(oldExpense.amount || 0);
            }
            
            const newOldBalance = oldBalance + Math.abs(oldAmountToProcess);
            
            const updatedOldAccount = { ...oldAccount, balance: newOldBalance.toString() };
            const updatedBankAccounts1 = state.bankAccounts.map(a => 
              a.id === oldExpense.bankAccountId ? updatedOldAccount : a
            );
            
            dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts1 });
            saveToLocalStorage('bankAccounts', updatedBankAccounts1);
          }
        }

        // Aplicar saldo na nova conta (se estiver pago)
        if (updates.bankAccountId && updates.bankAccountId !== 'cash' && oldExpense.isPaid) {
          const newAccount = state.bankAccounts.find(a => a.id === updates.bankAccountId);
          if (newAccount) {
            const newBalance = parseFloat(newAccount.balance || 0);
            const newAmount = parseFloat(updates.amount || oldExpense.amount || 0);
            
            // Calcular o valor a ser descontado
            let newAmountToProcess;
            if (oldExpense.isRecurring && oldExpense.installments > 1) {
              newAmountToProcess = newAmount / oldExpense.installments;
            } else {
              newAmountToProcess = newAmount;
            }
            
            const finalNewBalance = newBalance - Math.abs(newAmountToProcess);
            
            const updatedNewAccount = { ...newAccount, balance: finalNewBalance.toString() };
            const updatedBankAccounts2 = state.bankAccounts.map(a => 
              a.id === updates.bankAccountId ? updatedNewAccount : a
            );
            
            dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts2 });
            saveToLocalStorage('bankAccounts', updatedBankAccounts2);
          }
        }
      } else if (updates.amount && updates.amount !== oldExpense.amount && oldExpense.bankAccountId && oldExpense.bankAccountId !== 'cash' && oldExpense.isPaid) {
        // Se mudou apenas o valor e estava pago, ajustar o saldo
        const account = state.bankAccounts.find(a => a.id === oldExpense.bankAccountId);
        if (account) {
          const currentBalance = parseFloat(account.balance || 0);
          const oldAmount = parseFloat(oldExpense.amount || 0);
          const newAmount = parseFloat(updates.amount || 0);
          
          // Calcular diferença considerando parcelas
          let oldAmountToProcess, newAmountToProcess;
          if (oldExpense.isRecurring && oldExpense.installments > 1) {
            oldAmountToProcess = oldAmount / oldExpense.installments;
            newAmountToProcess = newAmount / oldExpense.installments;
          } else {
            oldAmountToProcess = oldAmount;
            newAmountToProcess = newAmount;
          }
          
          const difference = Math.abs(newAmountToProcess) - Math.abs(oldAmountToProcess);
          const finalBalance = currentBalance - difference;
          
          const updatedAccount = { ...account, balance: finalBalance.toString() };
          const updatedBankAccounts = state.bankAccounts.map(a => 
            a.id === oldExpense.bankAccountId ? updatedAccount : a
          );
          
          dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
          saveToLocalStorage('bankAccounts', updatedBankAccounts);
        }
      }
    }
  };

  const deleteExpense = (id) => {
    const expenseToDelete = state.expenses.find(expense => expense.id === id);
    const updatedExpenses = state.expenses.filter(expense => expense.id !== id);
    dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
    saveToLocalStorage('expenses', updatedExpenses);

    // Reverter o saldo da conta bancária apenas se a despesa estava paga
    if (expenseToDelete && expenseToDelete.bankAccountId && expenseToDelete.bankAccountId !== 'cash' && expenseToDelete.isPaid) {
      const account = state.bankAccounts.find(a => a.id === expenseToDelete.bankAccountId);
      if (account) {
        const currentBalance = parseFloat(account.balance || 0);
        
        // Calcular o valor a ser restaurado
        let expenseAmountToProcess;
        if (expenseToDelete.isRecurring && expenseToDelete.installments > 1) {
          const totalExpenseAmount = parseFloat(expenseToDelete.amount || 0);
          expenseAmountToProcess = totalExpenseAmount / expenseToDelete.installments;
        } else {
          expenseAmountToProcess = parseFloat(expenseToDelete.amount || 0);
        }
        
        const newBalance = currentBalance + Math.abs(expenseAmountToProcess); // Reverter a subtração
        
        const updatedAccount = { ...account, balance: newBalance.toString() };
        const updatedBankAccounts = state.bankAccounts.map(a => 
          a.id === expenseToDelete.bankAccountId ? updatedAccount : a
        );
        
        dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
        saveToLocalStorage('bankAccounts', updatedBankAccounts);
      }
    }
  };

    // Função para alternar status de pago de uma despesa (botão principal)
  const toggleExpensePaid = (id) => {
    const expense = state.expenses.find(expense => expense.id === id);
    if (expense && expense.bankAccountId && expense.bankAccountId !== 'cash') {
      const newIsPaid = !expense.isPaid;
      
      // Se é parcelado, atualizar todas as parcelas
      let updatedExpense;
      if (expense.isRecurring && expense.installments > 1) {
        const paidInstallments = Array(expense.installments).fill(newIsPaid);
        updatedExpense = { 
          ...expense, 
          isPaid: newIsPaid,
          paidInstallments: paidInstallments
        };
      } else {
        updatedExpense = { ...expense, isPaid: newIsPaid };
      }
      
      const updatedExpenses = state.expenses.map(exp => 
        exp.id === id ? updatedExpense : exp
      );
      
      dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
      saveToLocalStorage('expenses', updatedExpenses);

      // Atualizar o saldo da conta bancária
      const account = state.bankAccounts.find(a => a.id === expense.bankAccountId);
      if (account) {
        const currentBalance = parseFloat(account.balance || 0);
        
        if (expense.isRecurring && expense.installments > 1) {
          // Se é parcelado, calcular apenas o valor restante
          const totalAmount = parseFloat(expense.amount || 0);
          const installmentAmount = totalAmount / expense.installments;
          
          // Verificar quantas parcelas já estavam pagas antes
          const currentPaidInstallments = expense.paidInstallments || Array(expense.installments).fill(false);
          const previouslyPaidCount = currentPaidInstallments.filter(paid => paid).length;
          
          let newBalance;
          if (newIsPaid) {
            // Se marcou como pago, desconta apenas o valor das parcelas pendentes
            const remainingInstallments = expense.installments - previouslyPaidCount;
            const amountToDeduct = remainingInstallments * installmentAmount;
            newBalance = currentBalance - Math.abs(amountToDeduct);
          } else {
            // Se marcou como pendente, restaura apenas o valor das parcelas que estavam pagas
            const amountToRestore = previouslyPaidCount * installmentAmount;
            newBalance = currentBalance + Math.abs(amountToRestore);
          }
          
          const updatedAccount = { ...account, balance: newBalance.toString() };
          const updatedBankAccounts = state.bankAccounts.map(a => 
            a.id === expense.bankAccountId ? updatedAccount : a
          );
          
          dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
          saveToLocalStorage('bankAccounts', updatedBankAccounts);
        } else {
          // Se não é parcelado, usar o valor total
          const amountToProcess = parseFloat(expense.amount || 0);
          
          let newBalance;
          if (newIsPaid) {
            newBalance = currentBalance - Math.abs(amountToProcess);
          } else {
            newBalance = currentBalance + Math.abs(amountToProcess);
          }
          
          const updatedAccount = { ...account, balance: newBalance.toString() };
          const updatedBankAccounts = state.bankAccounts.map(a => 
            a.id === expense.bankAccountId ? updatedAccount : a
          );
          
          dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
          saveToLocalStorage('bankAccounts', updatedBankAccounts);
        }
      }
    } else if (expense) {
      // Se não tem conta bancária (ex: dinheiro em espécie), apenas atualiza o status
      const updatedExpense = { ...expense, isPaid: !expense.isPaid };
      const updatedExpenses = state.expenses.map(exp => 
        exp.id === id ? updatedExpense : exp
      );
      
      dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
      saveToLocalStorage('expenses', updatedExpenses);
    }
  };

  // Função para alternar status de uma parcela específica
  const toggleInstallmentPaid = (id, installmentIndex) => {
    const expense = state.expenses.find(expense => expense.id === id);
    if (expense && expense.bankAccountId && expense.bankAccountId !== 'cash' && expense.isRecurring && expense.installments > 1) {
      // Inicializar array de parcelas se não existir
      const currentInstallments = expense.paidInstallments || Array(expense.installments).fill(false);
      const updatedInstallments = [...currentInstallments];
      const wasPaid = updatedInstallments[installmentIndex];
      updatedInstallments[installmentIndex] = !wasPaid;
      
      // Calcular quantas parcelas estão pagas
      const paidCount = updatedInstallments.filter(paid => paid).length;
      const isFullyPaid = paidCount === expense.installments;
      
      const updatedExpense = { 
        ...expense, 
        paidInstallments: updatedInstallments,
        isPaid: isFullyPaid
      };
      
      const updatedExpenses = state.expenses.map(exp => 
        exp.id === id ? updatedExpense : exp
      );
      
      dispatch({ type: 'SET_EXPENSES', payload: updatedExpenses });
      saveToLocalStorage('expenses', updatedExpenses);

      // Atualizar o saldo da conta bancária apenas para esta parcela
      const account = state.bankAccounts.find(a => a.id === expense.bankAccountId);
      if (account) {
        const currentBalance = parseFloat(account.balance || 0);
        const totalAmount = parseFloat(expense.amount || 0);
        const installmentAmount = totalAmount / expense.installments;
        
        let newBalance;
        if (!wasPaid) {
          // Se estava pendente e agora está paga, desconta o valor da parcela
          newBalance = currentBalance - Math.abs(installmentAmount);
        } else {
          // Se estava paga e agora está pendente, restaura o valor da parcela
          newBalance = currentBalance + Math.abs(installmentAmount);
        }
        
        const updatedAccount = { ...account, balance: newBalance.toString() };
        const updatedBankAccounts = state.bankAccounts.map(a => 
          a.id === expense.bankAccountId ? updatedAccount : a
        );
        
        dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
        saveToLocalStorage('bankAccounts', updatedBankAccounts);
      }
    }
  };

  // Funções para gerenciar dívidas
  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedDebts = [...state.debts, newDebt];
    dispatch({ type: 'SET_DEBTS', payload: updatedDebts });
    saveToLocalStorage('debts', updatedDebts);
  };

  const updateDebt = (id, updates) => {
    const updatedDebts = state.debts.map(debt =>
      debt.id === id ? { ...debt, ...updates } : debt
    );
    dispatch({ type: 'SET_DEBTS', payload: updatedDebts });
    saveToLocalStorage('debts', updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = state.debts.filter(debt => debt.id !== id);
    dispatch({ type: 'SET_DEBTS', payload: updatedDebts });
    saveToLocalStorage('debts', updatedDebts);
  };

  // Funções para gerenciar contas fixas
  const addFixedBill = (fixedBill) => {
    const newFixedBill = {
      ...fixedBill,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedFixedBills = [...state.fixedBills, newFixedBill];
    dispatch({ type: 'SET_FIXED_BILLS', payload: updatedFixedBills });
    saveToLocalStorage('fixedBills', updatedFixedBills);
  };

  const updateFixedBill = (id, updates) => {
    const updatedFixedBills = state.fixedBills.map(fixedBill =>
      fixedBill.id === id ? { ...fixedBill, ...updates } : debt
    );
    dispatch({ type: 'SET_FIXED_BILLS', payload: updatedFixedBills });
    saveToLocalStorage('fixedBills', updatedFixedBills);
  };

  const deleteFixedBill = (id) => {
    const updatedFixedBills = state.fixedBills.filter(fixedBill => fixedBill.id !== id);
    dispatch({ type: 'SET_FIXED_BILLS', payload: updatedFixedBills });
    saveToLocalStorage('fixedBills', updatedFixedBills);
  };

  // Funções para gerenciar poupanças
  const addSaving = (saving) => {
    const newSaving = {
      ...saving,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedSavings = [...state.savings, newSaving];
    dispatch({ type: 'SET_SAVINGS', payload: updatedSavings });
    saveToLocalStorage('savings', updatedSavings);
  };

  const updateSaving = (id, updates) => {
    const updatedSavings = state.savings.map(saving =>
      saving.id === id ? { ...saving, ...updates } : saving
    );
    dispatch({ type: 'SET_SAVINGS', payload: updatedSavings });
    saveToLocalStorage('savings', updatedSavings);
  };

  const deleteSaving = (id) => {
    const updatedSavings = state.savings.filter(saving => saving.id !== id);
    dispatch({ type: 'SET_SAVINGS', payload: updatedSavings });
    saveToLocalStorage('savings', updatedSavings);
  };

  // Funções para gerenciar contas bancárias
  const addBankAccount = (bankAccount) => {
    const newBankAccount = {
      ...bankAccount,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Se for a primeira conta, definir como padrão
    if (state.bankAccounts.length === 0) {
      newBankAccount.isDefault = true;
    }
    
    const updatedBankAccounts = [...state.bankAccounts, newBankAccount];
    dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
    saveToLocalStorage('bankAccounts', updatedBankAccounts);
    
    // Se for a primeira conta, definir como selecionada
    if (state.bankAccounts.length === 0) {
      dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: newBankAccount.id });
      saveToLocalStorage('selectedAccount', newBankAccount.id);
    }
  };

  const updateBankAccount = (id, updates) => {
    const updatedBankAccounts = state.bankAccounts.map(account =>
      account.id === id ? { ...account, ...updates } : account
    );
    dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
    saveToLocalStorage('bankAccounts', updatedBankAccounts);
  };

  const deleteBankAccount = (id) => {
    const accountToDelete = state.bankAccounts.find(account => account.id === id);
    
    // Não permitir deletar se for a única conta
    if (state.bankAccounts.length === 1) {
      alert('Não é possível deletar a única conta. Adicione outra conta primeiro.');
      return;
    }
    
    const updatedBankAccounts = state.bankAccounts.filter(account => account.id !== id);
    
    // Se a conta deletada era a padrão, definir a primeira restante como padrão
    if (accountToDelete.isDefault) {
      updatedBankAccounts[0].isDefault = true;
    }
    
    dispatch({ type: 'SET_BANK_ACCOUNTS', payload: updatedBankAccounts });
    saveToLocalStorage('bankAccounts', updatedBankAccounts);
    
    // Se a conta deletada era a selecionada, selecionar a primeira disponível
    if (state.selectedAccount === id) {
      const newSelectedAccount = updatedBankAccounts[0]?.id || '';
      dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: newSelectedAccount });
      saveToLocalStorage('selectedAccount', newSelectedAccount);
    }
  };

  // Funções para gerenciar seleções
  const setSelectedAccount = (accountId) => {
    dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: accountId });
    saveToLocalStorage('selectedAccount', accountId);
  };

  const setSelectedMonth = (month) => {
    dispatch({ type: 'SET_SELECTED_MONTH', payload: month });
  };

  const setSelectedYear = (year) => {
    dispatch({ type: 'SET_SELECTED_YEAR', payload: year });
  };

  // Funções para resetar formulários
  const resetNewExpense = () => {
    dispatch({ type: 'RESET_NEW_EXPENSE' });
  };

  const resetNewDebt = () => {
    dispatch({ type: 'RESET_NEW_DEBT' });
  };

  const resetNewFixedBill = () => {
    dispatch({ type: 'RESET_NEW_FIXED_BILL' });
  };

  const resetNewSaving = () => {
    dispatch({ type: 'RESET_NEW_SAVING' });
  };

  const resetNewBankAccount = () => {
    dispatch({ type: 'RESET_NEW_BANK_ACCOUNT' });
  };

  // Funções para atualizar formulários
  const setNewExpense = (updates) => {
    dispatch({ type: 'SET_NEW_EXPENSE', payload: { ...state.newExpense, ...updates } });
  };

  const setNewDebt = (updates) => {
    dispatch({ type: 'SET_NEW_DEBT', payload: { ...state.newDebt, ...updates } });
  };

  const setNewFixedBill = (updates) => {
    dispatch({ type: 'SET_NEW_FIXED_BILL', payload: { ...state.newFixedBill, ...updates } });
  };

  const setNewSaving = (updates) => {
    dispatch({ type: 'SET_NEW_SAVING', payload: { ...state.newSaving, ...updates } });
  };

  const setNewBankAccount = (updates) => {
    dispatch({ type: 'SET_NEW_BANK_ACCOUNT', payload: { ...state.newBankAccount, ...updates } });
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpensePaid,
    toggleInstallmentPaid,
    addDebt,
    updateDebt,
    deleteDebt,
    addFixedBill,
    updateFixedBill,
    deleteFixedBill,
    addSaving,
    updateSaving,
    deleteSaving,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setSelectedAccount,
    setSelectedMonth,
    setSelectedYear,
    resetNewExpense,
    resetNewDebt,
    resetNewFixedBill,
    resetNewSaving,
    resetNewBankAccount,
    setNewExpense,
    setNewDebt,
    setNewFixedBill,
    setNewSaving,
    setNewBankAccount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook para usar o contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}