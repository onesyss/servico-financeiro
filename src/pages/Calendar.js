import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CalendarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

function Calendar() {
  const { 
    fixedBills, 
    debts, 
    updateFixedBill, 
    updateDebt, 
    deleteFixedBill,
    deleteDebt,
    addFixedBill, 
    addDebt,
    getBillsForDate,
    getOverdueBills,
    getUpcomingBills
  } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [newBill, setNewBill] = useState({
    description: '',
    amount: '',
    dueDate: '',
    category: 'Conta Fixa'
  });

  // Combinar contas fixas e dívidas para o calendário
  const getAllBills = () => {
    const fixedBillsWithType = fixedBills.map(bill => ({
      ...bill,
      type: 'fixed',
      dueDate: bill.dueDate || new Date().toISOString().split('T')[0]
    }));
    
    const debtsWithType = debts.map(debt => ({
      ...debt,
      type: 'debt',
      dueDate: debt.dueDate || new Date().toISOString().split('T')[0]
    }));

    return [...fixedBillsWithType, ...debtsWithType];
  };

  // Gerar dias do mês
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Adicionar dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Obter contas para uma data específica usando o contexto
  const getBillsForSelectedDate = (date) => {
    if (!date) return [];
    return getBillsForDate(date);
  };

  // Verificar se uma data tem contas vencidas
  const isOverdue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Alternar status de pagamento da conta
  const togglePaidStatus = (bill) => {
    if (bill.type === 'fixed') {
      updateFixedBill(bill.id, { ...bill, isPaid: !bill.isPaid });
    } else {
      updateDebt(bill.id, { ...bill, isPaid: !bill.isPaid });
    }
  };

  // Editar conta
  const handleEditBill = (bill) => {
    setEditingBill({
      ...bill,
      amount: (bill.amount || 0).toString(),
      dueDate: bill.dueDate || new Date().toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  // Excluir conta
  const handleDeleteBill = (bill) => {
    if (window.confirm(`Tem certeza que deseja excluir "${bill.description}"?`)) {
      if (bill.type === 'fixed') {
        deleteFixedBill(bill.id);
      } else {
        deleteDebt(bill.id);
      }
    }
  };

  // Salvar edição
  const handleSaveEdit = () => {
    if (editingBill && editingBill.description && editingBill.amount && editingBill.dueDate) {
      const updatedBill = {
        ...editingBill,
        amount: parseFloat(editingBill.amount) || 0,
        dueDate: editingBill.dueDate
      };

      if (editingBill.type === 'fixed') {
        updatedBill.dueDay = new Date(editingBill.dueDate).getDate();
        updateFixedBill(editingBill.id, updatedBill);
      } else {
        updateDebt(editingBill.id, updatedBill);
      }

      setShowEditModal(false);
      setEditingBill(null);
    }
  };

  // Adicionar nova conta
  const handleAddBill = () => {
    if (newBill.description && newBill.amount && newBill.dueDate) {
      const amount = parseFloat(newBill.amount) || 0;
      const billData = {
        description: newBill.description,
        amount: amount,
        dueDate: newBill.dueDate,
        category: newBill.category
      };

      if (newBill.category === 'Dívida') {
        billData.remainingAmount = amount;
        billData.totalAmount = amount;
        billData.installments = 1;
        billData.remainingInstallments = 1;
        billData.interestRate = 0;
        billData.priority = 'Média';
        addDebt(billData);
      } else {
        billData.dueDay = new Date(newBill.dueDate).getDate();
        billData.isEssential = false;
        addFixedBill(billData);
      }

      setShowAddModal(false);
      setNewBill({ description: '', amount: '', dueDate: '', category: 'Conta Fixa' });
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

     return (
     <div className="space-y-4">
             {/* Cabeçalho */}
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4">
           <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
           <div>
             <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Calendário de Contas</h1>
             <p className="text-gray-600 dark:text-gray-400">Acompanhe suas contas pendentes por data</p>
           </div>
         </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Conta
        </button>
      </div>

                    {/* Resumo de contas */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
           <div className="flex items-center">
             <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
             <div>
               <h3 className="font-semibold text-red-800 dark:text-red-200">Contas Vencidas</h3>
               <p className="text-red-600 dark:text-red-400">{getOverdueBills().length} contas</p>
             </div>
           </div>
         </div>
         
         <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
           <div className="flex items-center">
             <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
             <div>
               <h3 className="font-semibold text-blue-800 dark:text-blue-200">Próximos 7 dias</h3>
               <p className="text-blue-600 dark:text-blue-400">{getUpcomingBills(7).length} contas</p>
             </div>
           </div>
         </div>
         
         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
           <div className="flex items-center">
             <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
             <div>
               <h3 className="font-semibold text-green-800 dark:text-green-200">Contas Pagas</h3>
               <p className="text-green-600 dark:text-green-400">
                 {getAllBills().filter(bill => bill.isPaid).length} contas
               </p>
             </div>
           </div>
         </div>
       </div>

                    {/* Navegação do mês */}
       <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
         <button
           onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
           className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
         >
           ←
         </button>
         <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
           {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
         </h2>
         <button
           onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
           className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
         >
           →
         </button>
       </div>

             {/* Calendário */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
         {/* Cabeçalho dos dias da semana */}
         <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
           {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
             <div key={day} className="p-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
               {day}
             </div>
           ))}
         </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const billsForDay = getBillsForSelectedDate(day);
            const hasOverdue = day && isOverdue(day) && billsForDay.some(bill => !bill.isPaid);
            
            return (
              <div
                key={index}
                                 className={`
                   min-h-[80px] p-1 border-r border-b border-gray-200 dark:border-gray-600
                   ${day ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'bg-gray-50 dark:bg-gray-900'}
                   ${selectedDate && day && selectedDate.toDateString() === day.toDateString() ? 'bg-primary-50 dark:bg-primary-900/30' : ''}
                   ${hasOverdue ? 'bg-red-50 dark:bg-red-900/20' : ''}
                 `}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                                         <div className={`
                       text-xs font-medium mb-1
                       ${hasOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
                     `}>
                       {day.getDate()}
                     </div>
                    
                                         {/* Contas do dia */}
                     <div className="space-y-0.5">
                                               {billsForDay.slice(0, 2).map((bill) => (
                          <div
                            key={`${bill.type}-${bill.id}`}
                            className={`
                              text-xs p-0.5 rounded truncate cursor-pointer hover:opacity-80
                              ${bill.isPaid 
                                ? 'bg-green-100 text-green-800' 
                                : hasOverdue 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }
                            `}
                                                        title={`${bill.description} - R$ ${bill.amount || 0} (Clique para ver detalhes)`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(day);
                            }}
                          >
                            {bill.description}
                          </div>
                        ))}
                       {billsForDay.length > 2 && (
                         <div className="text-xs text-gray-500 text-center">
                           +{billsForDay.length - 2}
                         </div>
                       )}
                     </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

             {/* Detalhes do dia selecionado */}
               {selectedDate && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Contas para {selectedDate.toLocaleDateString('pt-BR')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getBillsForSelectedDate(selectedDate).length} conta(s) encontrada(s)
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          
                     <div className="space-y-3">
                           {getBillsForSelectedDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma conta para esta data.</p>
                  <button
                    onClick={() => {
                      setNewBill({...newBill, dueDate: selectedDate.toISOString().split('T')[0]});
                      setShowAddModal(true);
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Conta
                  </button>
                </div>
             ) : (
               <>
                                   <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      💡 <strong>Dica:</strong> Use os ícones ao lado de cada conta para editar ou excluir.
                    </p>
                  </div>
                 {getBillsForSelectedDate(selectedDate).map((bill) => (
                                 <div
                   key={`${bill.type}-${bill.id}`}
                   className={`
                     flex items-center justify-between p-3 rounded-lg border
                     ${bill.isPaid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}
                   `}
                 >
                   <div className="flex items-center space-x-3">
                     {bill.isPaid ? (
                       <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                     ) : isOverdue(selectedDate) ? (
                       <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                     ) : (
                       <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                     )}
                     <div>
                       <div className="font-medium text-gray-900 dark:text-gray-100">{bill.description}</div>
                       <div className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</div>
                     </div>
                   </div>
                                                                           <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">R$ {bill.amount || 0}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePaidStatus(bill)}
                          className={`px-3 py-1 text-white text-sm rounded hover:opacity-80 ${
                            bill.isPaid 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {bill.isPaid ? 'Marcar como Pendente' : 'Marcar como Paga'}
                        </button>
                        <button
                          onClick={() => handleEditBill(bill)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Excluir"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                                 </div>
               ))}
               </>
             )}
           </div>
        </div>
      )}

             {/* Modal para adicionar conta */}
       {showAddModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                         <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Adicionar Nova Conta</h3>
            
            <div className="space-y-4">
                                                           <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição da Conta
                  </label>
                  <input
                    type="text"
                    value={newBill.description}
                    onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Conta de Luz"
                  />
                </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Valor
                 </label>
                 <input
                   type="number"
                   value={newBill.amount}
                   onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                   placeholder="0,00"
                   step="0.01"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Data de Vencimento
                 </label>
                 <input
                   type="date"
                   value={newBill.dueDate}
                   onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Categoria
                 </label>
                 <select
                   value={newBill.category}
                   onChange={(e) => setNewBill({...newBill, category: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                  <option value="Conta Fixa">Conta Fixa</option>
                  <option value="Dívida">Dívida</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Outros">Outros</option>
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
                 onClick={handleAddBill}
                 className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
               >
                 Adicionar
               </button>
             </div>
          </div>
                 </div>
       )}

               {/* Modal para editar conta */}
        {showEditModal && editingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Editar Conta</h3>
             
             <div className="space-y-4">
                               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição da Conta
                  </label>
                  <input
                    type="text"
                    value={editingBill.description}
                    onChange={(e) => setEditingBill({...editingBill, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Conta de Luz"
                  />
                </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Valor
                 </label>
                 <input
                   type="number"
                   value={editingBill.amount}
                   onChange={(e) => setEditingBill({...editingBill, amount: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                   placeholder="0,00"
                   step="0.01"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Data de Vencimento
                 </label>
                 <input
                   type="date"
                   value={editingBill.dueDate}
                   onChange={(e) => setEditingBill({...editingBill, dueDate: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Categoria
                 </label>
                 <select
                   value={editingBill.category}
                   onChange={(e) => setEditingBill({...editingBill, category: e.target.value})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                   <option value="Conta Fixa">Conta Fixa</option>
                   <option value="Dívida">Dívida</option>
                   <option value="Alimentação">Alimentação</option>
                   <option value="Transporte">Transporte</option>
                   <option value="Lazer">Lazer</option>
                   <option value="Outros">Outros</option>
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Status
                 </label>
                 <select
                   value={editingBill.isPaid ? 'paid' : 'pending'}
                   onChange={(e) => setEditingBill({...editingBill, isPaid: e.target.value === 'paid'})}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                   <option value="pending">Pendente</option>
                   <option value="paid">Paga</option>
                 </select>
               </div>
             </div>
             
             <div className="flex justify-end space-x-3 mt-6">
               <button
                 onClick={() => {
                   setShowEditModal(false);
                   setEditingBill(null);
                 }}
                 className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
               >
                 Cancelar
               </button>
               <button
                 onClick={handleSaveEdit}
                 className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
               >
                 Salvar
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }

export default Calendar;
