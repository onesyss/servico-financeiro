import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { CalendarIcon, CreditCardIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const { 
    expenses, 
    debts, 
    fixedBills, 
    savingsGoals,
    calculateTotalExpenses,
    calculateTotalDebts,
    calculateTotalFixedBills,
    calculateTotalSavings,
    getExpensesByCategory
  } = useAppContext();

  // Estado para o mês e ano selecionados
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Estado para armazenar dados dos gráficos
  const [expenseChartData, setExpenseChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }],
  });

  // Estado para armazenar dados do gráfico de barras mensal
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Gastos Mensais',
      data: [],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1,
    }],
  });

  // Atualizar dados do gráfico quando as despesas mudarem
  useEffect(() => {
    updateChartData();
    updateMonthlyChartData();
  }, [expenses, selectedMonth, selectedYear]);

  // Função para atualizar dados do gráfico de categorias
  const updateChartData = () => {
    const categories = getExpensesByCategory(selectedMonth, selectedYear);
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    // Cores para as categorias
    const backgroundColors = [
      'rgba(99, 102, 241, 0.6)',   // Indigo
      'rgba(239, 68, 68, 0.6)',    // Red
      'rgba(16, 185, 129, 0.6)',   // Green
      'rgba(245, 158, 11, 0.6)',   // Amber
      'rgba(14, 165, 233, 0.6)',   // Sky
      'rgba(168, 85, 247, 0.6)',   // Purple
      'rgba(236, 72, 153, 0.6)',   // Pink
      'rgba(59, 130, 246, 0.6)',   // Blue
    ];
    
    const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
    
    setExpenseChartData({
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1,
      }],
    });
  };

  // Função para atualizar dados do gráfico mensal
  const updateMonthlyChartData = () => {
    // Obter os últimos 6 meses
    const months = [];
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      let month = selectedMonth - i;
      let year = selectedYear;
      
      if (month <= 0) {
        month += 12;
        year -= 1;
      }
      
      const monthName = new Date(year, month - 1, 1).toLocaleString('pt-BR', { month: 'short' });
      months.push(`${monthName}/${year}`);
      
      const total = calculateTotalExpenses(month, year);
      monthlyData.push(total);
    }
    
    setMonthlyChartData({
      labels: months,
      datasets: [{
        label: 'Gastos Mensais',
        data: monthlyData,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      }],
    });
  };

  // Opções para os gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Calcular totais
  const totalExpensesMonth = calculateTotalExpenses(selectedMonth, selectedYear);
  const totalDebts = calculateTotalDebts();
  const totalFixedBills = calculateTotalFixedBills();
  const totalSavings = calculateTotalSavings();

  // Calcular contas fixas pendentes
  const pendingBills = fixedBills.filter(bill => !bill.isPaid);

  // Calcular dicas de economia
  const savingsTips = [];
  
  // Verificar gastos por categoria para sugerir dicas
  const categories = getExpensesByCategory(selectedMonth, selectedYear);
  
  if (categories['Alimentação'] && categories['Alimentação'] > 500) {
    savingsTips.push('Considere preparar mais refeições em casa para reduzir gastos com alimentação.');
  }
  
  if (categories['Lazer'] && categories['Lazer'] > 300) {
    savingsTips.push('Seus gastos com lazer estão altos. Procure alternativas gratuitas ou mais baratas de entretenimento.');
  }
  
  if (totalFixedBills > 0.5 * totalExpensesMonth) {
    savingsTips.push('Suas contas fixas representam mais de 50% dos seus gastos. Considere renegociar ou buscar alternativas mais econômicas.');
  }
  
  if (totalDebts > 0) {
    savingsTips.push('Priorize o pagamento das dívidas com juros mais altos para economizar a longo prazo.');
  }
  
  // Adicionar dicas gerais se não houver dicas específicas
  if (savingsTips.length === 0) {
    savingsTips.push('Estabeleça um orçamento mensal e acompanhe seus gastos regularmente.');
    savingsTips.push('Considere automatizar suas economias transferindo um valor fixo para poupança todo mês.');
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Cartões de resumo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg dashboard-card">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Gastos do Mês</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">R$ {totalExpensesMonth.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dashboard-card">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <CreditCardIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total em Dívidas</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">R$ {totalDebts.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dashboard-card">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <BanknotesIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Contas Fixas</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">R$ {totalFixedBills.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg dashboard-card">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Economizado</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">R$ {totalSavings.toFixed(2)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de mês e ano */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Análise de Gastos</h2>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">Mês</label>
              <select
                id="month"
                name="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano</label>
              <select
                id="year"
                name="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">Gastos por Categoria</h3>
            <div className="h-64">
              {expenseChartData.labels.length > 0 ? (
                <Doughnut data={expenseChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sem dados para exibir
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">Gastos dos Últimos 6 Meses</h3>
            <div className="h-64">
              {monthlyChartData.labels.length > 0 ? (
                <Bar 
                  data={monthlyChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Sem dados para exibir
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contas pendentes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contas Pendentes</h2>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingBills.length > 0 ? (
                pendingBills.map((bill) => (
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma conta pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dicas de economia */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Dicas de Economia</h2>
        <ul className="space-y-3">
          {savingsTips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;