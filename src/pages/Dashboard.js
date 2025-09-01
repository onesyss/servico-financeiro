import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { CalendarIcon, CreditCardIcon, BanknotesIcon, ArrowTrendingUpIcon, WalletIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import SyncStatus from '../components/SyncStatus';
import SyncDebug from '../components/SyncDebug';
import SyncTest from '../components/SyncTest';
import QuotaStatus from '../components/QuotaStatus';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const { 
    expenses, 
    debts, 
    fixedBills, 
    savingsGoals,
    accountBalance,
    bankAccounts,
    isLoading,
    lastSync,
    syncError,
    syncRetryCount,
    forceSync,
    calculateTotalExpenses,
    calculateTotalDebts,
    calculateTotalFixedBills,
    calculateTotalSavings,
    getExpensesByCategory,
    getTotalBankBalance
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

  // Atualizar cores quando o tema mudar
  useEffect(() => {
    updateChartData();
    updateMonthlyChartData();
  }, [document.documentElement.classList.contains('dark')]);

  // Forçar re-render dos gráficos quando o tema mudar
  useEffect(() => {
    const handleThemeChange = () => {
      // Forçar re-render dos componentes de gráfico
      setExpenseChartData(prev => ({ ...prev }));
      setMonthlyChartData(prev => ({ ...prev }));
    };

    // Observar mudanças na classe do documento
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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

  // Função para atualizar dados do gráfico de categorias
  const updateChartData = () => {
    const categories = getExpensesByCategory(selectedMonth, selectedYear);
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    // Cores para as categorias - adaptadas para modo escuro
    const isDarkMode = document.documentElement.classList.contains('dark');
    const backgroundColors = isDarkMode ? [
      'rgba(139, 92, 246, 0.9)',   // Violet (mais vibrante no escuro)
      'rgba(239, 68, 68, 0.9)',    // Red (mais intenso)
      'rgba(34, 197, 94, 0.9)',    // Green (mais brilhante)
      'rgba(245, 158, 11, 0.9)',   // Amber (mantido)
      'rgba(14, 165, 233, 0.9)',   // Sky (mais vibrante)
      'rgba(168, 85, 247, 0.9)',   // Purple (mantido)
      'rgba(236, 72, 153, 0.9)',   // Pink (mais intenso)
      'rgba(59, 130, 246, 0.9)',   // Blue (mais vibrante)
    ] : [
      'rgba(79, 70, 229, 0.8)',    // Indigo (mais escuro)
      'rgba(220, 38, 38, 0.8)',    // Red (mais escuro)
      'rgba(5, 150, 105, 0.8)',    // Green (mais escuro)
      'rgba(217, 119, 6, 0.8)',    // Amber (mais escuro)
      'rgba(2, 132, 199, 0.8)',    // Sky (mais escuro)
      'rgba(147, 51, 234, 0.8)',   // Purple (mais escuro)
      'rgba(219, 39, 119, 0.8)',   // Pink (mais escuro)
      'rgba(37, 99, 235, 0.8)',    // Blue (mais escuro)
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
      
      const monthName = new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'short' });
      months.push(monthName);
      
      const totalExpenses = calculateTotalExpenses(month, year);
      monthlyData.push(totalExpenses);
    }
    
    const isDarkMode = document.documentElement.classList.contains('dark');
    setMonthlyChartData({
      labels: months,
      datasets: [{
        label: 'Gastos Mensais',
        data: monthlyData,
        backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(67, 56, 202, 0.9)',
        borderColor: isDarkMode ? 'rgb(139, 92, 246)' : 'rgb(67, 56, 202)',
        borderWidth: 2,
      }],
    });
  };

  // Calcular totais
  const totalExpensesMonth = calculateTotalExpenses(selectedMonth, selectedYear);
  const totalDebts = calculateTotalDebts();
  const totalFixedBills = calculateTotalFixedBills();
  const totalSavings = calculateTotalSavings();
  const totalBankBalance = getTotalBankBalance();

  // Função para obter configurações dos gráficos baseadas no tema atual
  const getChartOptions = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            font: {
              size: 12,
              weight: '600'
            },
            padding: 15,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDarkMode ? '#e5e7eb' : '#1f2937',
          bodyColor: isDarkMode ? '#d1d5db' : '#374151',
          borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
        },
      },
    };
  };

  // Função para obter configurações do gráfico de barras baseadas no tema atual
  const getBarChartOptions = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const chartOptions = getChartOptions();
    
    return {
      ...chartOptions,
      backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.1)' : 'rgba(249, 250, 251, 0.5)',
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: isDarkMode ? '#f9fafb' : '#111827',
            font: {
              size: 11,
              weight: '600'
            },
            callback: function(value) {
              return formatCurrency(value);
            },
          },
          grid: {
            color: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(156, 163, 175, 0.4)',
            lineWidth: 1,
          },
          border: {
            color: isDarkMode ? '#374151' : '#d1d5db',
          },
        },
        x: {
          ticks: {
            color: isDarkMode ? '#f9fafb' : '#111827',
            font: {
              size: 11,
              weight: '600'
            },
          },
          grid: {
            color: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(156, 163, 175, 0.4)',
            lineWidth: 1,
          },
          border: {
            color: isDarkMode ? '#374151' : '#d1d5db',
          },
        },
      },
    };
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral das suas finanças</p>
          {lastSync && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Última sincronização: {lastSync.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <SyncStatus 
            isLoading={isLoading} 
            lastSync={lastSync} 
            syncError={syncError}
            syncRetryCount={syncRetryCount}
          />
          {syncError && (
            <button
              onClick={forceSync}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Sincronizar Manualmente
            </button>
          )}
        </div>
      </div>

      {/* Status da Cota do Firebase */}
      <QuotaStatus syncError={syncError} />

      {/* Debug de Sincronização - Remover depois */}
      <SyncDebug />
      
      {/* Teste de Sincronização - Remover depois */}
      <SyncTest />

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-1.5 sm:p-2">
                <WalletIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Saldo Disponível</dt>
                  <dd className="flex items-baseline">
                                    <div className={`text-base font-semibold ${accountBalance.currentBalance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(accountBalance.currentBalance)}
                </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/40 rounded-lg p-3">
                <BuildingLibraryIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Bancos</dt>
                  <dd className="flex items-baseline">
                                    <div className={`text-base font-semibold ${totalBankBalance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(totalBankBalance)}
                </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-3">
                <BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Contas Fixas</dt>
                  <dd className="flex items-baseline">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalFixedBills)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/40 rounded-lg p-3">
                <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total em Dívidas</dt>
                  <dd className="flex items-baseline">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalDebts)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/40 rounded-lg p-3">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Gastos do Mês</dt>
                  <dd className="flex items-baseline">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalExpensesMonth)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 dashboard-card hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300">
          <div className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/40 rounded-lg p-3">
                <ArrowTrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-2 sm:ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Economizado</dt>
                  <dd className="flex items-baseline">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalSavings)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de mês e ano */}
                  <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Análise de Gastos</h2>
          <div className="flex space-x-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mês</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={1}>Janeiro</option>
                <option value={2}>Fevereiro</option>
                <option value={3}>Março</option>
                <option value={4}>Abril</option>
                <option value={5}>Maio</option>
                <option value={6}>Junho</option>
                <option value={7}>Julho</option>
                <option value={8}>Agosto</option>
                <option value={9}>Setembro</option>
                <option value={10}>Outubro</option>
                <option value={11}>Novembro</option>
                <option value={12}>Dezembro</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de pizza - Gastos por categoria */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Gastos por Categoria</h3>
            <div className="h-64">
              {expenseChartData.labels.length > 0 ? (
                <Doughnut data={expenseChartData} options={getChartOptions()} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de barras - Gastos mensais */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Gastos dos Últimos 6 Meses</h3>
            <div className="h-64">
              <Bar data={monthlyChartData} options={getBarChartOptions()} />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo das contas bancárias */}
      {bankAccounts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Resumo das Contas Bancárias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankAccounts.map((account) => (
              <div 
                key={account.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                style={{ borderLeftColor: account.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: account.color }}
                    ></div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {account.institution ? account.institution : account.bank}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{account.name}</p>
                <p className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;