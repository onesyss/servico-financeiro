import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BanknotesIcon, 
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

function AccountBalance() {
  const { 
    accountBalance, 
    bankAccounts,
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    setInitialBalance,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    getTotalBankBalance
  } = useAppContext();
  
  // Hook para gerenciar alertas
  const { alert, showDeleteConfirm, showEditConfirm, showSuccess, showError, hideAlert } = useAlert();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInitialBalanceModal, setShowInitialBalanceModal] = useState(false);
  const [showBankAccountModal, setShowBankAccountModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingBankAccount, setEditingBankAccount] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'income', // 'income' ou 'expense'
    category: 'Outros',
    bankAccountId: bankAccounts.length > 0 ? bankAccounts.find(a => a.isDefault)?.id : null
  });
  const [newBankAccount, setNewBankAccount] = useState({
    name: '',
    bank: '',
    balance: '',
    color: '#3B82F6'
  });
  const [initialBalance, setInitialBalanceValue] = useState('');
  const [isEditingBalance, setIsEditingBalance] = useState(false);

  // Categorias para transações
  const categories = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Outros'
  ];

  // Cores disponíveis para contas bancárias
  const accountColors = [
    '#3B82F6', // Azul
    '#EF4444', // Vermelho
    '#10B981', // Verde
    '#F59E0B', // Amarelo
    '#8B5CF6', // Roxo
    '#F97316', // Laranja
    '#06B6D4', // Ciano
    '#84CC16', // Verde lima
    '#EC4899', // Rosa
    '#6B7280'  // Cinza
  ];

  // Função para adicionar transação
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.bankAccountId) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const amount = parseFloat(newTransaction.amount);
      const transactionData = {
        ...newTransaction,
        amount: newTransaction.type === 'expense' ? -amount : amount
      };
      
      addTransaction(transactionData);
      setShowAddModal(false);
      setNewTransaction({ 
        description: '', 
        amount: '', 
        type: 'income', 
        category: 'Outros',
        bankAccountId: bankAccounts.find(a => a.isDefault)?.id || null
      });
      showSuccess('Transação adicionada com sucesso!');
    } catch (error) {
      showError('Erro ao adicionar transação. Tente novamente.');
    }
  };

  // Função para editar transação
  const handleEditTransaction = () => {
    if (!editingTransaction || !editingTransaction.description || !editingTransaction.amount || !editingTransaction.bankAccountId) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const amount = parseFloat(editingTransaction.amount);
      const transactionData = {
        ...editingTransaction,
        amount: editingTransaction.type === 'expense' ? -amount : amount
      };
      
      updateTransaction(editingTransaction.id, transactionData);
      setShowEditModal(false);
      setEditingTransaction(null);
      showSuccess('Transação atualizada com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar transação. Tente novamente.');
    }
  };

  // Função para excluir transação
  const handleDeleteTransaction = (id) => {
    const transaction = accountBalance.transactions.find(t => t.id === id);
    if (transaction) {
      showDeleteConfirm(transaction.description, () => {
        try {
          deleteTransaction(id);
          showSuccess('Transação excluída com sucesso!');
        } catch (error) {
          showError('Erro ao excluir transação. Tente novamente.');
        }
      });
    }
  };

  // Função para adicionar conta bancária
  const handleAddBankAccount = () => {
    if (!newBankAccount.name || !newBankAccount.bank) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      addBankAccount(newBankAccount);
      setShowBankAccountModal(false);
      setNewBankAccount({ name: '', bank: '', balance: '', color: '#3B82F6' });
      showSuccess('Conta bancária adicionada com sucesso!');
    } catch (error) {
      showError('Erro ao adicionar conta bancária. Tente novamente.');
    }
  };

  // Função para editar conta bancária
  const handleEditBankAccount = () => {
    if (!editingBankAccount || !editingBankAccount.name || !editingBankAccount.bank) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      updateBankAccount(editingBankAccount.id, editingBankAccount);
      setShowBankAccountModal(false);
      setEditingBankAccount(null);
      showSuccess('Conta bancária atualizada com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar conta bancária. Tente novamente.');
    }
  };

  // Função para excluir conta bancária
  const handleDeleteBankAccount = (id) => {
    const account = bankAccounts.find(a => a.id === id);
    if (account) {
      if (bankAccounts.length === 1) {
        showError('Não é possível excluir a única conta bancária.');
        return;
      }
      
      showDeleteConfirm(`${account.name} (${account.bank})`, () => {
        try {
          deleteBankAccount(id);
          showSuccess('Conta bancária excluída com sucesso!');
        } catch (error) {
          showError('Erro ao excluir conta bancária. Tente novamente.');
        }
      });
    }
  };

  // Função para definir saldo inicial
  const handleSetInitialBalance = () => {
    if (!initialBalance) {
      showError('Por favor, informe o valor do saldo inicial.');
      return;
    }
    
    try {
      setInitialBalance(parseFloat(initialBalance));
      setShowInitialBalanceModal(false);
      setInitialBalanceValue('');
      setIsEditingBalance(false);
      showSuccess('Saldo inicial definido com sucesso!');
    } catch (error) {
      showError('Erro ao definir saldo inicial. Tente novamente.');
    }
  };

  // Função para iniciar edição
  const handleStartEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      type: transaction.amount >= 0 ? 'income' : 'expense',
      amount: Math.abs(transaction.amount).toString()
    });
    setShowEditModal(true);
  };

  // Função para iniciar edição de conta bancária
  const handleStartEditBankAccount = (account) => {
    setEditingBankAccount({ ...account });
    setShowBankAccountModal(true);
  };

  // Função para definir conta padrão
  const handleSetDefaultAccount = (id) => {
    setDefaultBankAccount(id);
    showSuccess('Conta padrão definida com sucesso!');
  };

  // Calcular totais
  const totalIncome = accountBalance.transactions
    .filter(t => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);

  const totalExpenses = accountBalance.transactions
    .filter(t => t.amount < 0)
    .reduce((total, t) => total + Math.abs(t.amount), 0);

  const availableBalance = accountBalance.currentBalance;
  const totalBankBalance = getTotalBankBalance();

  // Função para obter nome da conta bancária
  const getBankAccountName = (id) => {
    const account = bankAccounts.find(a => a.id === id);
    return account ? `${account.name} (${account.bank})` : 'Conta não encontrada';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BanknotesIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Saldo em Conta</h1>
            <p className="text-gray-600 dark:text-gray-400">Controle suas entradas e saídas</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowBankAccountModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <BuildingLibraryIcon className="w-5 h-5 mr-2" />
            Gerenciar Contas
          </button>
          <button
            onClick={() => {
              setInitialBalanceValue('');
              setIsEditingBalance(false);
              setShowInitialBalanceModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Definir Saldo Inicial
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Resumo das contas bancárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bankAccounts.map((account) => (
          <div 
            key={account.id} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            style={{ borderLeftColor: account.color, borderLeftWidth: '4px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: account.color }}
                ></div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {account.name}
                </h3>
                {account.isDefault && (
                  <StarIcon className="w-4 h-4 text-yellow-500" title="Conta padrão" />
                )}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleStartEditBankAccount(account)}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  title="Editar"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                {!account.isDefault && (
                  <button
                    onClick={() => handleDeleteBankAccount(account.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Excluir"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{account.bank}</p>
            <p className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              R$ {account.balance.toFixed(2)}
            </p>
            {!account.isDefault && (
              <button
                onClick={() => handleSetDefaultAccount(account.id)}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Definir como padrão
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Resumo do saldo geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Total de Entradas</h3>
              <p className="text-green-600 dark:text-green-400">R$ {totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <ArrowDownIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Total de Saídas</h3>
              <p className="text-red-600 dark:text-red-400">R$ {totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BanknotesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Saldo Disponível</h3>
                <p className={`text-lg font-bold ${availableBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  R$ {availableBalance.toFixed(2)}
                </p>
              </div>
            </div>
            {availableBalance !== 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setInitialBalanceValue(availableBalance.toString());
                    setIsEditingBalance(true);
                    setShowInitialBalanceModal(true);
                  }}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  title="Editar Saldo"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    showDeleteConfirm('Saldo Disponível', () => {
                      try {
                        setInitialBalance(0);
                        showSuccess('Saldo zerado com sucesso!');
                      } catch (error) {
                        showError('Erro ao zerar saldo. Tente novamente.');
                      }
                    });
                  }}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Zerar Saldo"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center">
            <BuildingLibraryIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Total Bancos</h3>
              <p className={`text-lg font-bold ${totalBankBalance >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                R$ {totalBankBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de transações */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Histórico de Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {accountBalance.transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                accountBalance.transactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.bankAccountId ? getBankAccountName(transaction.bankAccountId) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}R$ {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(transaction)}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            title="Editar"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Excluir"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar transação */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nova Transação</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conta Bancária *
                </label>
                <select
                  value={newTransaction.bankAccountId || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, bankAccountId: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.bank}) - R$ {account.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Salário mensal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar transação */}
      {showEditModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Transação</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conta Bancária *
                </label>
                <select
                  value={editingTransaction.bankAccountId || ''}
                  onChange={(e) => setEditingTransaction({...editingTransaction, bankAccountId: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.bank}) - R$ {account.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={editingTransaction.type}
                  onChange={(e) => setEditingTransaction({...editingTransaction, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({...editingTransaction, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Salário mensal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({...editingTransaction, amount: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={editingTransaction.category}
                  onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditTransaction}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para gerenciar contas bancárias */}
      {showBankAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingBankAccount ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
              </h3>
              <button
                onClick={() => {
                  setShowBankAccountModal(false);
                  setEditingBankAccount(null);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Conta *
                </label>
                <input
                  type="text"
                  value={editingBankAccount ? editingBankAccount.name : newBankAccount.name}
                  onChange={(e) => {
                    if (editingBankAccount) {
                      setEditingBankAccount({...editingBankAccount, name: e.target.value});
                    } else {
                      setNewBankAccount({...newBankAccount, name: e.target.value});
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Conta Corrente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Banco *
                </label>
                <input
                  type="text"
                  value={editingBankAccount ? editingBankAccount.bank : newBankAccount.bank}
                  onChange={(e) => {
                    if (editingBankAccount) {
                      setEditingBankAccount({...editingBankAccount, bank: e.target.value});
                    } else {
                      setNewBankAccount({...newBankAccount, bank: e.target.value});
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Banco do Brasil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Saldo Inicial
                </label>
                <input
                  type="number"
                  value={editingBankAccount ? editingBankAccount.balance : newBankAccount.balance}
                  onChange={(e) => {
                    if (editingBankAccount) {
                      setEditingBankAccount({...editingBankAccount, balance: e.target.value});
                    } else {
                      setNewBankAccount({...newBankAccount, balance: e.target.value});
                    }
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor da Conta
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {accountColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        if (editingBankAccount) {
                          setEditingBankAccount({...editingBankAccount, color});
                        } else {
                          setNewBankAccount({...newBankAccount, color});
                        }
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        (editingBankAccount ? editingBankAccount.color : newBankAccount.color) === color
                          ? 'border-gray-900 dark:border-gray-100'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBankAccountModal(false);
                  setEditingBankAccount(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingBankAccount ? handleEditBankAccount : handleAddBankAccount}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {editingBankAccount ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para definir saldo inicial */}
      {showInitialBalanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditingBalance ? 'Editar Saldo' : 'Definir Saldo Inicial'}
              </h3>
              <button
                onClick={() => {
                  setShowInitialBalanceModal(false);
                  setIsEditingBalance(false);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isEditingBalance ? 'Novo Saldo (R$)' : 'Saldo Inicial (R$)'}
                </label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalanceValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              {isEditingBalance && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Atenção:</strong> Esta ação irá substituir o saldo atual de R$ {availableBalance.toFixed(2)} pelo novo valor.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowInitialBalanceModal(false);
                  setIsEditingBalance(false);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSetInitialBalance}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {isEditingBalance ? 'Salvar' : 'Definir'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Componente de Alerta */}
      <Alert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={hideAlert}
      />
    </div>
  );
}

export default AccountBalance;
