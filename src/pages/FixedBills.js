import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

function FixedBills() {
  // Usar o contexto global para acessar as contas fixas
  const { fixedBills, addFixedBill, updateFixedBill, deleteFixedBill, toggleFixedBillPaid, addDebt } = useApp();
  
  // Hook para gerenciar alertas
  const { alert, showDeleteConfirm, showEditConfirm, showSuccess, showError, hideAlert } = useAlert();

  // Estado para o formulário de nova conta fixa
  const [newBill, setNewBill] = useState({
    description: '',
    amount: '',
    dueDay: '',
    category: '',
    isPaid: false,
    isEssential: false
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
    type: 'fixed-bill', // 'debt' ou 'fixed-bill'
    category: 'Outros'
  });

  // Categorias disponíveis
  const categories = ['Moradia', 'Serviços', 'Saúde', 'Educação', 'Transporte', 'Entretenimento', 'Outros'];

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBill({
      ...newBill,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Função para adicionar ou atualizar uma conta fixa
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!newBill.description || !newBill.amount || !newBill.dueDay || !newBill.category) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      if (editMode) {
        // Atualizar conta fixa existente
        updateFixedBill(editId, { ...newBill, id: editId });
        setEditMode(false);
        setEditId(null);
        showSuccess('Conta fixa atualizada com sucesso!');
      } else {
        // Adicionar nova conta fixa
        addFixedBill(newBill);
        showSuccess('Conta fixa adicionada com sucesso!');
      }
      
      // Limpar formulário
      setNewBill({
        description: '',
        amount: '',
        dueDay: '',
        category: '',
        isPaid: false,
        isEssential: false
      });
    } catch (error) {
      showError('Erro ao salvar conta fixa. Tente novamente.');
    }
  };

  // Função para iniciar a edição de uma conta fixa
  const handleEdit = (bill) => {
    showEditConfirm(bill.description, () => {
      setNewBill({
        description: bill.description,
        amount: bill.amount,
        dueDay: bill.dueDay,
        category: bill.category,
        isPaid: bill.isPaid,
        isEssential: bill.isEssential
      });
      setEditMode(true);
      setEditId(bill.id);
    });
  };

  // Função para excluir uma conta fixa
  const handleDelete = (id) => {
    const bill = fixedBills.find(b => b.id === id);
    if (bill) {
      showDeleteConfirm(bill.description, () => {
        try {
          deleteFixedBill(id);
          showSuccess('Conta fixa excluída com sucesso!');
        } catch (error) {
          showError('Erro ao excluir conta fixa. Tente novamente.');
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
        type: 'fixed-bill',
        category: 'Outros'
      });
      setShowRecurringModal(false);
    }
  };

  // Função para alternar o status de pagamento
  const togglePaidStatus = (id) => {
    toggleFixedBillPaid(id);
  };

  // Calcular total das contas fixas
  const totalFixedBills = fixedBills.reduce((total, bill) => total + parseFloat(bill.amount), 0);

  // Calcular total das contas essenciais
  const totalEssentialBills = fixedBills
    .filter(bill => bill.isEssential)
    .reduce((total, bill) => total + parseFloat(bill.amount), 0);

  // Calcular total das contas não essenciais
  const totalNonEssentialBills = fixedBills
    .filter(bill => !bill.isEssential)
    .reduce((total, bill) => total + parseFloat(bill.amount), 0);

  // Calcular total das contas pagas
  const totalPaidBills = fixedBills
    .filter(bill => bill.isPaid)
    .reduce((total, bill) => total + parseFloat(bill.amount), 0);

  // Calcular total das contas não pagas
  const totalUnpaidBills = fixedBills
    .filter(bill => !bill.isPaid)
    .reduce((total, bill) => total + parseFloat(bill.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contas Fixas</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              Total Mensal: R$ {totalFixedBills.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pendente: R$ {totalUnpaidBills.toFixed(2)}
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

      {/* Formulário para adicionar/editar conta fixa */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {editMode ? 'Editar Conta Fixa' : 'Adicionar Nova Conta Fixa'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                value={newBill.description}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor (R$)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="amount"
                id="amount"
                value={newBill.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dia de Vencimento
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="dueDay"
                id="dueDay"
                value={newBill.dueDay}
                onChange={handleInputChange}
                required
                min="1"
                max="31"
                step="1"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <div className="mt-1">
              <select
                name="category"
                id="category"
                value={newBill.category}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <div className="flex items-center h-5">
              <input
                id="isPaid"
                name="isPaid"
                type="checkbox"
                checked={newBill.isPaid}
                onChange={handleInputChange}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Pago
              </label>
            </div>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <div className="flex items-center h-5">
              <input
                id="isEssential"
                name="isEssential"
                type="checkbox"
                checked={newBill.isEssential}
                onChange={handleInputChange}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Essencial
              </label>
            </div>
          </div>

          <div className="sm:col-span-6 flex justify-end">
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditId(null);
                  setNewBill({
                    description: '',
                    amount: '',
                    dueDay: '',
                    category: '',
                    isPaid: false,
                    isEssential: false
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

      {/* Resumo das contas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Mensal</dt>
            <dd className="mt-1 text-3xl font-semibold text-primary-600 dark:text-primary-400">R$ {totalFixedBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Contas Essenciais</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600 dark:text-yellow-400">R$ {totalEssentialBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Contas Não Essenciais</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-400">R$ {totalNonEssentialBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Contas Pendentes</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600 dark:text-red-400">R$ {totalUnpaidBills.toFixed(2)}</dd>
          </div>
        </div>
      </div>

      {/* Lista de contas fixas */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {fixedBills.length > 0 ? (
                fixedBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {bill.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      R$ {parseFloat(bill.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Dia {bill.dueDay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {bill.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => togglePaidStatus(bill.id)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${bill.isPaid ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}
                      >
                        {bill.isPaid ? 'Pago' : 'Pendente'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${bill.isEssential ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'}`}>
                        {bill.isEssential ? 'Essencial' : 'Não Essencial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma conta fixa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas de economia */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dicas para Reduzir Contas Fixas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Serviços</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Compare planos de internet e telefonia regularmente</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Avalie se realmente precisa de todos os serviços de streaming</span>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Energia</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Troque lâmpadas por modelos LED de baixo consumo</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Desligue aparelhos em standby quando não estiver usando</span>
              </li>
            </ul>
          </div>
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
                    <option value="fixed-bill">Contas Fixas Recorrentes</option>
                    <option value="debt">Dívida Parcelada</option>
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
                    <strong>Preview:</strong> Valor por parcela: R$ {(parseFloat(recurringData.totalAmount || 0) / parseInt(recurringData.installments || 1)).toFixed(2)}
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

export default FixedBills;