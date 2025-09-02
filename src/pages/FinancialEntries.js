import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BanknotesIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/outline';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

function FinancialEntries() {
  const { 
    expenses,
    bankAccounts,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpensePaid,
    toggleInstallmentPaid
  } = useApp();
  
  const { alert, showDeleteConfirm, showSuccess, showError, hideAlert } = useAlert();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    description: '',
    subcategory: '',
    amount: '',
    paymentMethod: 'debit',
    bankAccountId: '',
    dueDate: '',
    isRecurring: false,
    installments: 1
  });

  // Categorias e subcategorias
  const categories = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Vestuário',
    'Serviços',
    'Outros'
  ];

  const subcategories = {
    'Alimentação': ['Supermercado', 'Restaurante', 'Delivery', 'Café', 'Outros'],
    'Transporte': ['Combustível', 'Ônibus/Metrô', 'Uber/99', 'Manutenção', 'Seguro', 'Outros'],
    'Moradia': ['Aluguel', 'Condomínio', 'Conta de Luz', 'Conta de Água', 'Internet', 'Outros'],
    'Lazer': ['Cinema', 'Teatro', 'Viagem', 'Esporte', 'Hobby', 'Outros'],
    'Saúde': ['Médico', 'Farmácia', 'Plano de Saúde', 'Dentista', 'Outros'],
    'Educação': ['Escola/Faculdade', 'Cursos', 'Livros', 'Material Escolar', 'Outros'],
    'Vestuário': ['Roupas', 'Calçados', 'Acessórios', 'Outros'],
    'Serviços': ['Assinaturas', 'Manutenção', 'Limpeza', 'Outros'],
    'Outros': ['Imprevistos', 'Presentes', 'Doações', 'Outros']
  };

  // Formas de pagamento
  const paymentMethods = [
    { value: 'debit', label: 'Débito' },
    { value: 'credit', label: 'Crédito' },
    { value: 'pix', label: 'PIX' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'transfer', label: 'Transferência' },
    { value: 'boleto', label: 'Boleto' }
  ];

  // Função para formatar números com separadores de milhares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Função para obter nome da conta bancária
  const getBankAccountName = (id) => {
    if (id === 'cash') return 'Dinheiro em Espécie';
    const account = bankAccounts.find(a => a.id === id);
    if (!account) return 'Conta não encontrada';
    
    let displayName = '';
    if (account.institution) {
      displayName = `${account.institution} - ${account.name}`;
    } else if (account.bank) {
      displayName = `${account.bank} - ${account.name}`;
    } else {
      displayName = account.name;
    }
    
    return displayName;
  };



  // Função para adicionar lançamento
  const handleAddEntry = () => {
    if (!newEntry.description || !newEntry.amount || !newEntry.bankAccountId || !newEntry.dueDate) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
             const entryData = {
         ...newEntry,
         id: Date.now().toString(),
         amount: parseFloat(newEntry.amount),
         isPaid: false,
         createdAt: new Date().toISOString(),
         date: newEntry.dueDate,
         category: newEntry.subcategory,
         type: 'expense',
         paidInstallments: newEntry.isRecurring && newEntry.installments > 1 
           ? Array(newEntry.installments).fill(false) 
           : undefined
       };
      
      addExpense(entryData);
      setShowAddModal(false);
      setNewEntry({
        description: '',
        subcategory: '',
        amount: '',
        paymentMethod: 'debit',
        bankAccountId: '',
        dueDate: '',
        isRecurring: false,
        installments: 1
      });
      showSuccess('Lançamento adicionado com sucesso!');
    } catch (error) {
      showError('Erro ao adicionar lançamento. Tente novamente.');
    }
  };

  // Função para editar lançamento
  const handleEditEntry = () => {
    if (!editingEntry || !editingEntry.description || !editingEntry.amount || !editingEntry.bankAccountId || !editingEntry.dueDate) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const entryData = {
        ...editingEntry,
        amount: parseFloat(editingEntry.amount),
        date: editingEntry.dueDate,
        category: editingEntry.subcategory,
        type: 'expense'
      };
      
      updateExpense(editingEntry.id, entryData);
      setShowEditModal(false);
      setEditingEntry(null);
      showSuccess('Lançamento atualizado com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar lançamento. Tente novamente.');
    }
  };

  // Função para excluir lançamento
  const handleDeleteEntry = (id) => {
    const entry = expenses.find(e => e.id === id);
    if (entry) {
      showDeleteConfirm(entry.description, () => {
        try {
          deleteExpense(id);
          showSuccess('Lançamento excluído com sucesso!');
        } catch (error) {
          showError('Erro ao excluir lançamento. Tente novamente.');
        }
      });
    }
  };

  // Função para iniciar edição
  const handleStartEdit = (entry) => {
    setEditingEntry({ ...entry });
    setShowEditModal(true);
  };



  // Função para obter label da forma de pagamento
  const getPaymentMethodLabel = (value) => {
    const method = paymentMethods.find(m => m.value === value);
    return method ? method.label : value;
  };

  // Calcular totais
  const totalPending = expenses
    .filter(entry => !entry.isPaid)
    .reduce((total, entry) => total + parseFloat(entry.amount), 0);

  const totalPaid = expenses
    .filter(entry => entry.isPaid)
    .reduce((total, entry) => total + parseFloat(entry.amount), 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BanknotesIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lançamentos Financeiros</h1>
            <p className="text-gray-600 dark:text-gray-400">Controle suas despesas e receitas</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Lançamento
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <BanknotesIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Total Pendente</h3>
              <p className="text-red-600 dark:text-red-400">R$ {totalPending.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Total Pago</h3>
              <p className="text-green-600 dark:text-green-400">R$ {totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <BanknotesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Total Geral</h3>
              <p className="text-blue-600 dark:text-blue-400">R$ {(totalPending + totalPaid).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de lançamentos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Lançamentos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subcategoria</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pagamento</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conta</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vencimento</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parcelas</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                             {expenses.length === 0 ? (
                 <tr>
                   <td colSpan="9" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                     Nenhum lançamento encontrado
                   </td>
                 </tr>
               ) : (
                expenses
                  .sort((a, b) => new Date(a.dueDate || a.date) - new Date(b.dueDate || b.date))
                  .map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleExpensePaid(entry.id)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.isPaid
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {entry.isPaid ? (
                            <>
                              <CheckIcon className="w-3 h-3 mr-1" />
                              Pago
                            </>
                          ) : (
                            <>
                              <XMarkIconSolid className="w-3 h-3 mr-1" />
                              Pendente
                            </>
                          )}
                        </button>
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                         {entry.description}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.subcategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          R$ {parseFloat(entry.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getPaymentMethodLabel(entry.paymentMethod)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getBankAccountName(entry.bankAccountId)}
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                         {new Date(entry.dueDate).toLocaleDateString('pt-BR')}
                       </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {entry.isRecurring && entry.installments > 1 ? (
                             <div className="text-center">
                               <div className="text-xs text-gray-500 mb-1">
                                 {entry.installments}x
                               </div>
                               <div className="flex flex-wrap gap-1 justify-center">
                                 {Array.from({ length: entry.installments }, (_, index) => {
                                   const isPaid = entry.paidInstallments ? entry.paidInstallments[index] : false;
                                   return (
                                     <button
                                       key={index}
                                       onClick={() => toggleInstallmentPaid(entry.id, index)}
                                       className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium cursor-pointer hover:scale-110 transition-transform ${
                                         isPaid 
                                           ? 'bg-green-500 text-white hover:bg-green-600' 
                                           : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                                       }`}
                                       title={`Parcela ${index + 1} - ${isPaid ? 'Paga' : 'Pendente'} - Clique para alterar`}
                                     >
                                       {index + 1}
                                     </button>
                                   );
                                 })}
                               </div>
                               <div className="text-xs mt-1">
                                 {entry.paidInstallments ? (
                                   (() => {
                                     const paidCount = entry.paidInstallments.filter(paid => paid).length;
                                     const totalCount = entry.installments;
                                     if (paidCount === 0) {
                                       return <span className="text-red-600 dark:text-red-400">Todas pendentes</span>;
                                     } else if (paidCount === totalCount) {
                                       return <span className="text-green-600 dark:text-green-400">Todas pagas</span>;
                                     } else {
                                       return <span className="text-yellow-600 dark:text-yellow-400">{paidCount}/{totalCount} pagas</span>;
                                     }
                                   })()
                                 ) : (
                                   <span className="text-red-600 dark:text-red-400">Todas pendentes</span>
                                 )}
                               </div>
                             </div>
                           ) : (
                             <div className="text-center">
                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">À vista</span>
                             </div>
                           )}
                         </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            title="Editar"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
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

      {/* Modal para adicionar lançamento */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Novo Lançamento</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Conta de luz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={newEntry.category || ''}
                  onChange={(e) => setNewEntry({...newEntry, category: e.target.value, subcategory: ''})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subcategoria
                </label>
                <select
                  value={newEntry.subcategory}
                  onChange={(e) => setNewEntry({...newEntry, subcategory: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={!newEntry.category}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {newEntry.category && subcategories[newEntry.category]?.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={newEntry.paymentMethod}
                  onChange={(e) => setNewEntry({...newEntry, paymentMethod: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conta Bancária (Saída) *
                </label>
                <select
                  value={newEntry.bankAccountId}
                  onChange={(e) => setNewEntry({...newEntry, bankAccountId: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma conta</option>
                  <option value="cash">Dinheiro em Espécie</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {getBankAccountName(account.id)} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={newEntry.dueDate}
                  onChange={(e) => setNewEntry({...newEntry, dueDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newEntry.isRecurring}
                      onChange={(e) => setNewEntry({...newEntry, isRecurring: e.target.checked})}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Lançamento Fixo/Parcelado
                    </span>
                  </label>
                  
                  {newEntry.isRecurring && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Parcelas:
                      </label>
                      <input
                        type="number"
                        value={newEntry.installments}
                        onChange={(e) => setNewEntry({...newEntry, installments: parseInt(e.target.value) || 1})}
                        className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        min="1"
                        max="60"
                      />
                    </div>
                  )}
                </div>
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
                onClick={handleAddEntry}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar lançamento */}
      {showEditModal && editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Lançamento</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({...editingEntry, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Conta de luz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  value={editingEntry.category || ''}
                  onChange={(e) => setEditingEntry({...editingEntry, category: e.target.value, subcategory: ''})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subcategoria
                </label>
                <select
                  value={editingEntry.subcategory}
                  onChange={(e) => setEditingEntry({...editingEntry, subcategory: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={!editingEntry.category}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {editingEntry.category && subcategories[editingEntry.category]?.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  value={editingEntry.amount}
                  onChange={(e) => setEditingEntry({...editingEntry, amount: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={editingEntry.paymentMethod}
                  onChange={(e) => setEditingEntry({...editingEntry, paymentMethod: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conta Bancária (Saída) *
                </label>
                <select
                  value={editingEntry.bankAccountId}
                  onChange={(e) => setEditingEntry({...editingEntry, bankAccountId: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione uma conta</option>
                  <option value="cash">Dinheiro em Espécie</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {getBankAccountName(account.id)} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={editingEntry.dueDate}
                  onChange={(e) => setEditingEntry({...editingEntry, dueDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingEntry.isRecurring || false}
                      onChange={(e) => setEditingEntry({...editingEntry, isRecurring: e.target.checked})}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Lançamento Fixo/Parcelado
                    </span>
                  </label>
                  
                  {editingEntry.isRecurring && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Parcelas:
                      </label>
                      <input
                        type="number"
                        value={editingEntry.installments || 1}
                        onChange={(e) => setEditingEntry({...editingEntry, installments: parseInt(e.target.value) || 1})}
                        className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        min="1"
                        max="60"
                      />
                    </div>
                  )}
                </div>
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
                onClick={handleEditEntry}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Salvar
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

export default FinancialEntries;
