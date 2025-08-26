import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

function Savings() {
  // Usar o contexto global para acessar as metas de economia
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addAmountToSavingsGoal } = useAppContext();

  // Estado para o formulário de nova meta de economia
  const [newGoal, setNewGoal] = useState({
    description: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: ''
  });

  // Estado para controlar o modo de edição
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Estado para armazenar as dicas de economia
  const [savingsTips] = useState([
    {
      id: 1,
      title: 'Regra 50/30/20',
      description: 'Destine 50% da sua renda para necessidades básicas, 30% para desejos e 20% para economias e investimentos.'
    },
    {
      id: 2,
      title: 'Automatize suas economias',
      description: 'Configure transferências automáticas para sua conta poupança no dia do pagamento.'
    },
    {
      id: 3,
      title: 'Desafio das moedas',
      description: 'Guarde todas as moedas de um determinado valor por um mês e deposite na sua poupança.'
    },
    {
      id: 4,
      title: 'Revisão mensal de gastos',
      description: 'Reserve um dia por mês para revisar todos os seus gastos e identificar onde pode economizar.'
    },
  ]);

  // Prioridades disponíveis
  const priorities = ['Alta', 'Média', 'Baixa'];

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value,
    });
  };

  // Função para adicionar ou atualizar uma meta de economia
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Atualizar meta existente
      updateSavingsGoal(editId, { ...newGoal, id: editId });
      setEditMode(false);
      setEditId(null);
    } else {
      // Adicionar nova meta
      addSavingsGoal(newGoal);
    }
    
    // Limpar formulário
    setNewGoal({
      description: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: ''
    });
  };

  // Função para iniciar a edição de uma meta
  const handleEdit = (goal) => {
    setNewGoal({
      description: goal.description,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      priority: goal.priority
    });
    setEditMode(true);
    setEditId(goal.id);
  };

  // Função para excluir uma meta
  const handleDelete = (id) => {
    deleteSavingsGoal(id);
  };

  // Função para adicionar valor a uma meta
  const handleAddAmount = (id, amount) => {
    addAmountToSavingsGoal(id, amount);
  };

  // Calcular total economizado
  const totalSaved = savingsGoals.reduce((total, goal) => total + parseFloat(goal.currentAmount), 0);

  // Calcular total a economizar
  const totalTarget = savingsGoals.reduce((total, goal) => total + parseFloat(goal.targetAmount), 0);

  // Calcular porcentagem total economizada
  const totalPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Metas de Economia</h1>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            Economizado: R$ {totalSaved.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Meta Total: R$ {totalTarget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progresso geral */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Progresso Geral</h2>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 dark:text-primary-400 bg-primary-200 dark:bg-primary-900/30">
                {totalPercentage.toFixed(1)}% Concluído
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-400">
                R$ {totalSaved.toFixed(2)} / R$ {totalTarget.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200 dark:bg-primary-900/30">
            <div
              style={{ width: `${totalPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
            ></div>
          </div>
        </div>
      </div>

      {/* Formulário para adicionar/editar meta */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {editMode ? 'Editar Meta de Economia' : 'Adicionar Nova Meta de Economia'}
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
                value={newGoal.description}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor Meta (R$)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="targetAmount"
                id="targetAmount"
                value={newGoal.targetAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor Atual (R$)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="currentAmount"
                id="currentAmount"
                value={newGoal.currentAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Limite
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="deadline"
                id="deadline"
                value={newGoal.deadline}
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
                value={newGoal.priority}
                onChange={handleInputChange}
                required
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione...</option>
                {priorities.map((priority) => (
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
                  setNewGoal({
                    description: '',
                    targetAmount: '',
                    currentAmount: '',
                    deadline: '',
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

      {/* Lista de metas de economia */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progresso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor Atual
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor Meta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data Limite
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prioridade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Adicionar
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {savingsGoals.length > 0 ? (
                savingsGoals.map((goal) => {
                  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <tr key={goal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {goal.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        R$ {parseFloat(goal.currentAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        R$ {parseFloat(goal.targetAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${goal.priority === 'Alta' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 
                            goal.priority === 'Média' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'}`}>
                          {goal.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddAmount(goal.id, 50)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => handleAddAmount(goal.id, 100)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700"
                          >
                            +100
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma meta de economia cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas de economia */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dicas para Economizar</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {savingsTips.map((tip) => (
            <div key={tip.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calculadora de economia */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Calculadora de Economia</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Economizando pequenas quantias diariamente, você pode acumular uma quantia significativa ao longo do tempo.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">R$ 5 por dia</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 150 por mês</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 1.825 por ano</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">R$ 10 por dia</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 300 por mês</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 3.650 por ano</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">R$ 20 por dia</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 600 por mês</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">R$ 7.300 por ano</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savings;