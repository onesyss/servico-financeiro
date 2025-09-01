import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

function Debts() {
  // Usar o contexto global para acessar as dívidas
  const { debts, addDebt, updateDebt, deleteDebt, addFixedBill } = useAppContext();
  
  // Hook para gerenciar alertas
  const { alert, showDeleteConfirm, showEditConfirm, showSuccess, showError, hideAlert } = useAlert();

  // Estado para o formulário de nova dívida
  const [newDebt, setNewDebt] = useState({
    description: '',
    totalAmount: '',
    remainingAmount: '',
    installments: '',
    remainingInstallments: '',
    interestRate: '',
    dueDate: '',
    priority: ''
  });

  // Estado para controlar o modo de edição
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Estado para modal de lançamentos recorrentes
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recurringData, setRecurringData] = useState({
    description: '',
    totalAmount: '',
    installments: '',
    startDate: '',
    dueDay: '',
    type: 'debt', // 'debt' ou 'fixed-bill'
    category: 'Outros'
  });

  // Opções de prioridade
  const priorityOptions = ['Alta', 'Média', 'Baixa'];

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDebt({
      ...newDebt,
      [name]: value,
    });
  };

  // Função para adicionar ou atualizar uma dívida
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!newDebt.description || !newDebt.totalAmount || !newDebt.remainingAmount || !newDebt.installments || !newDebt.priority) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      if (editMode) {
        // Atualizar dívida existente
        updateDebt(editId, { ...newDebt, id: editId });
        setEditMode(false);
        setEditId(null);
        showSuccess('Dívida atualizada com sucesso!');
      } else {
        // Adicionar nova dívida
        addDebt(newDebt);
        showSuccess('Dívida adicionada com sucesso!');
      }
      
      // Limpar formulário
      setNewDebt({
        description: '',
        totalAmount: '',
        remainingAmount: '',
        installments: '',
        remainingInstallments: '',
        interestRate: '',
        dueDate: '',
        priority: ''
      });
    } catch (error) {
      showError('Erro ao salvar dívida. Tente novamente.');
    }
  };

  // Função para iniciar a edição de uma dívida
  const handleEdit = (debt) => {
    showEditConfirm(debt.description, () => {
      setNewDebt({
        description: debt.description,
        totalAmount: debt.totalAmount,
        remainingAmount: debt.remainingAmount,
        installments: debt.installments,
        remainingInstallments: debt.remainingInstallments,
        interestRate: debt.interestRate,
        dueDate: debt.dueDate,
        priority: debt.priority
      });
      setEditMode(true);
      setEditId(debt.id);
    });
  };

  // Função para excluir uma dívida
  const handleDelete = (id) => {
    const debt = debts.find(d => d.id === id);
    if (debt) {
      showDeleteConfirm(debt.description, () => {
        try {
          deleteDebt(id);
          showSuccess('Dívida excluída com sucesso!');
        } catch (error) {
          showError('Erro ao excluir dívida. Tente novamente.');
        }
      });
    }
  };

  // Função para lidar com mudanças no formulário de lançamentos recorrentes
  const handleRecurringInputChange = (e) => {
    const { name, value } = e.target;
    setRecurringData({
      ...recurringData,
      [name]: value,
    });
  };

  // Função para criar lançamentos recorrentes
  const handleCreateRecurring = () => {
    if (recurringData.description && recurringData.totalAmount && recurringData.installments && recurringData.startDate) {
      const totalAmount = parseFloat(recurringData.totalAmount);
      const installments = parseInt(recurringData.installments);
      const installmentAmount = totalAmount / installments;
      const startDate = new Date(recurringData.startDate);
      
      if (recurringData.type === 'debt') {
        // Criar dívida parcelada
        const debtData = {
          description: recurringData.description,
          totalAmount: totalAmount,
          remainingAmount: totalAmount,
          installments: installments,
          remainingInstallments: installments,
          interestRate: '0',
          dueDate: startDate.toISOString(),
          priority: 'Média'
        };
        addDebt(debtData);
      } else {
        // Criar contas fixas recorrentes
        for (let i = 0; i < installments; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          
          const fixedBillData = {
            description: `${recurringData.description} - Parcela ${i + 1}/${installments}`,
            amount: installmentAmount,
            dueDay: dueDate.getDate(),
            isEssential: false,
            category: recurringData.category
          };
          addFixedBill(fixedBillData);
        }
      }
      
      // Limpar formulário e fechar modal
      setRecurringData({
        description: '',
        totalAmount: '',
        installments: '',
        startDate: '',
        dueDay: '',
        type: 'debt',
        category: 'Outros'
      });
      setShowRecurringModal(false);
    }
  };

  // Função para formatar números com separadores de milhares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calcular total das dívidas
  const totalDebt = debts.reduce((total, debt) => total + parseFloat(debt.remainingAmount), 0);

  // Calcular valor mensal estimado de pagamento
  const calculateMonthlyPayment = (debt) => {
    return debt.remainingAmount / debt.remainingInstallments;
  };

  // Calcular total mensal de pagamentos
  const totalMonthlyPayment = debts.reduce((total, debt) => {
    return total + calculateMonthlyPayment(debt);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Controle de Dívidas</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Total: {formatCurrency(totalDebt)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pagamento mensal estimado: {formatCurrency(totalMonthlyPayment)}
            </p>
          </div>
          <button
            onClick={() => setShowRecurringModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Lançamento Recorrente
          </button>
        </div>
      </div>

      {/* Formulário para adicionar/editar dívida */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {editMode ? 'Editar Dívida' : 'Adicionar Nova Dívida'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                value={newDebt.description}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor Total (R$)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="totalAmount"
                id="totalAmount"
                value={newDebt.totalAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="remainingAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor Restante (R$)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="remainingAmount"
                id="remainingAmount"
                value={newDebt.remainingAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="installments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total de Parcelas
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="installments"
                id="installments"
                value={newDebt.installments}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="remainingInstallments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Parcelas Restantes
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="remainingInstallments"
                id="remainingInstallments"
                value={newDebt.remainingInstallments}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Taxa de Juros (%)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="interestRate"
                id="interestRate"
                value={newDebt.interestRate}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Vencimento
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={newDebt.dueDate}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <div className="mt-1">
              <select
                name="priority"
                id="priority"
                value={newDebt.priority}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione...</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-6 flex justify-end">
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditId(null);
                  setNewDebt({
                    description: '',
                    totalAmount: '',
                    remainingAmount: '',
                    installments: '',
                    remainingInstallments: '',
                    interestRate: '',
                    dueDate: '',
                    priority: ''
                  });
                }}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {editMode ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de dívidas */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor Restante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Parcelas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Juros
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pagamento Mensal
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {debts.length > 0 ? (
                debts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {debt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(parseFloat(debt.remainingAmount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {debt.remainingInstallments} / {debt.installments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {parseFloat(debt.interestRate).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(debt.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${debt.priority === 'Alta' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 
                          debt.priority === 'Média' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 
                          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>
                        {debt.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(calculateMonthlyPayment(debt))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(debt)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma dívida cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo e dicas */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Resumo */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Resumo de Dívidas</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total em Dívidas</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalDebt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pagamento Mensal</dt>
              <dd className="mt-1 text-2xl font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(totalMonthlyPayment)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dívidas de Alta Prioridade</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {debts.filter(debt => debt.priority === 'Alta').length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Próximo Vencimento</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {debts.length > 0 ? (
                  new Date(debts.reduce((nearest, debt) => {
                    return new Date(debt.dueDate) < new Date(nearest.dueDate) ? debt : nearest;
                  }, debts[0]).dueDate).toLocaleDateString('pt-BR')
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Dicas */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dicas para Quitar Dívidas</h2>
          <ul className="space-y-3">
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Priorize dívidas com juros mais altos</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Negocie taxas menores com credores</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Considere consolidar dívidas menores</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Crie um fundo de emergência para evitar novas dívidas</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal de Lançamentos Recorrentes */}
      {showRecurringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Criar Lançamento Recorrente</h3>
              <button
                onClick={() => setShowRecurringModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={recurringData.description}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Compra de eletrodomésticos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Lançamento
                  </label>
                  <select
                    name="type"
                    value={recurringData.type}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="debt">Dívida Parcelada</option>
                    <option value="fixed-bill">Contas Fixas Recorrentes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Total (R$)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={recurringData.totalAmount}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    name="installments"
                    value={recurringData.installments}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="1"
                    min="1"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={recurringData.startDate}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={recurringData.category}
                    onChange={handleRecurringInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Outros">Outros</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                  </select>
                </div>
              </div>

              {/* Preview do valor da parcela */}
              {recurringData.totalAmount && recurringData.installments && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Preview:</strong> Valor por parcela: {formatCurrency(parseFloat(recurringData.totalAmount || 0) / parseInt(recurringData.installments || 1))}
                  </p>
                </div>
              )}

              {/* Informações específicas por tipo */}
              {recurringData.type === 'debt' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Dívida Parcelada:</strong> Será criada uma dívida única com controle de parcelas restantes.
                  </p>
                </div>
              )}

              {recurringData.type === 'fixed-bill' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Contas Fixas Recorrentes:</strong> Serão criadas {recurringData.installments || 0} contas fixas individuais, uma para cada parcela.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRecurringModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRecurring}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Criar Lançamento
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

export default Debts;