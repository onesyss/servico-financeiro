import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

function Debts() {
  // Usar o contexto global para acessar as dívidas
  const { debts, addDebt, updateDebt, deleteDebt } = useAppContext();

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
    
    if (editMode) {
      // Atualizar dívida existente
      updateDebt(editId, { ...newDebt, id: editId });
      setEditMode(false);
      setEditId(null);
    } else {
      // Adicionar nova dívida
      addDebt(newDebt);
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
  };

  // Função para iniciar a edição de uma dívida
  const handleEdit = (debt) => {
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
  };

  // Função para excluir uma dívida
  const handleDelete = (id) => {
    deleteDebt(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Controle de Dívidas</h1>
        <div className="text-right">
          <p className="text-lg font-semibold text-red-600">
            Total: R$ {totalDebt.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Pagamento mensal estimado: R$ {totalMonthlyPayment.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Formulário para adicionar/editar dívida */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {editMode ? 'Editar Dívida' : 'Adicionar Nova Dívida'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="remainingAmount" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="installments" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="remainingInstallments" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
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
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Prioridade
            </label>
            <div className="mt-1">
              <select
                name="priority"
                id="priority"
                value={newDebt.priority}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
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

      {/* Lista de dívidas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Restante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcelas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Juros
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento Mensal
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {debts.length > 0 ? (
                debts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {debt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {parseFloat(debt.remainingAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {debt.remainingInstallments} / {debt.installments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(debt.interestRate).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(debt.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${debt.priority === 'Alta' ? 'bg-red-100 text-red-800' : 
                          debt.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {debt.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {calculateMonthlyPayment(debt).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(debt)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
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
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo de Dívidas</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total em Dívidas</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600">R$ {totalDebt.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pagamento Mensal</dt>
              <dd className="mt-1 text-2xl font-semibold text-primary-600">R$ {totalMonthlyPayment.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dívidas de Alta Prioridade</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {debts.filter(debt => debt.priority === 'Alta').length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Próximo Vencimento</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
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
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dicas para Quitar Dívidas</h2>
          <ul className="space-y-3">
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Priorize dívidas com juros mais altos</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Negocie taxas menores com credores</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Considere consolidar dívidas menores</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Crie um fundo de emergência para evitar novas dívidas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Debts;