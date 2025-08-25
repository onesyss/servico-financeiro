import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

function FixedBills() {
  // Usar o contexto global para acessar as contas fixas
  const { fixedBills, addFixedBill, updateFixedBill, deleteFixedBill, toggleFixedBillPaid } = useAppContext();

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
    
    if (editMode) {
      // Atualizar conta fixa existente
      updateFixedBill(editId, { ...newBill, id: editId });
      setEditMode(false);
      setEditId(null);
    } else {
      // Adicionar nova conta fixa
      addFixedBill(newBill);
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
  };

  // Função para iniciar a edição de uma conta fixa
  const handleEdit = (bill) => {
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
  };

  // Função para excluir uma conta fixa
  const handleDelete = (id) => {
    deleteFixedBill(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Contas Fixas</h1>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary-600">
            Total Mensal: R$ {totalFixedBills.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Pendente: R$ {totalUnpaidBills.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Formulário para adicionar/editar conta fixa */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {editMode ? 'Editar Conta Fixa' : 'Adicionar Nova Conta Fixa'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <div className="mt-1">
              <select
                name="category"
                id="category"
                value={newBill.category}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
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
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-700">
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
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Mensal</dt>
            <dd className="mt-1 text-3xl font-semibold text-primary-600">R$ {totalFixedBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Contas Essenciais</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">R$ {totalEssentialBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Contas Não Essenciais</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">R$ {totalNonEssentialBills.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Contas Pendentes</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">R$ {totalUnpaidBills.toFixed(2)}</dd>
          </div>
        </div>
      </div>

      {/* Lista de contas fixas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fixedBills.length > 0 ? (
                fixedBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {parseFloat(bill.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Dia {bill.dueDay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => togglePaidStatus(bill.id)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${bill.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {bill.isPaid ? 'Pago' : 'Pendente'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${bill.isEssential ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {bill.isEssential ? 'Essencial' : 'Não Essencial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma conta fixa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas de economia */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Dicas para Reduzir Contas Fixas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Serviços</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Compare planos de internet e telefonia regularmente</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Avalie se realmente precisa de todos os serviços de streaming</span>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Energia</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Troque lâmpadas por modelos LED de baixo consumo</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Desligue aparelhos em standby quando não estiver usando</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixedBills;