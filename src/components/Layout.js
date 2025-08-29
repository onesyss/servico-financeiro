import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAlert from '../hooks/useAlert';
import Alert from './Alert';
import { 
  HomeIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ClipboardDocumentListIcon, 
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  WalletIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { alert, showLogoutConfirm, hideAlert } = useAlert();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen(!desktopSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLogoutClick = () => {
    showLogoutConfirm(handleLogout);
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  // Função para exibir apenas nome e sobrenome
  const getDisplayName = (fullName) => {
    if (!fullName) return '';
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    }
    return nameParts[0] || '';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Saldo em Conta', path: '/account-balance', icon: WalletIcon },
    { name: 'Lançamentos', path: '/financial-entries', icon: BanknotesIcon },
    { name: 'Contas Fixas', path: '/fixed-bills', icon: ClipboardDocumentListIcon },
    { name: 'Dívidas', path: '/debts', icon: BanknotesIcon },
    { name: 'Despesas', path: '/expenses', icon: CreditCardIcon },
    { name: 'Economia', path: '/savings', icon: ArrowTrendingUpIcon },
    { name: 'Relatórios', path: '/reports', icon: DocumentChartBarIcon },
    { name: 'Suporte', path: '/support', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para mobile */}
      <div className={`
        fixed inset-0 z-40 lg:hidden
        ${sidebarOpen ? 'block' : 'hidden'}
      `}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">ControlFin</span>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                onClick={toggleSidebar}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
            
            {/* Separador */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            
            {/* Botão Sair */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Sair
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${desktopSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className={`flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${desktopSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">ControlFin</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
            
            {/* Separador */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            
            {/* Botão Sair */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Sair
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:px-6">
          {/* Lado esquerdo */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 lg:hidden hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="hidden lg:inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={toggleDesktopSidebar}
              title={desktopSidebarOpen ? 'Ocultar menu lateral' : 'Mostrar menu lateral'}
            >
              {desktopSidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
            <div className="lg:hidden ml-2">
              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">ControlFin</span>
            </div>
            <div className="hidden lg:block text-sm text-gray-700 dark:text-gray-300 ml-2">
              Olá, {currentUser?.displayName ? getDisplayName(currentUser.displayName) : currentUser?.email}
            </div>
          </div>
          
          {/* Lado direito - Ícones */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEditProfile}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              title="Editar Perfil"
            >
              <UserCircleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title={isDarkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleLogoutClick}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              title="Sair"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      
      {/* Componente de Alert */}
      <Alert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={hideAlert}
        showCheckbox={alert.showCheckbox}
        checkboxLabel={alert.checkboxLabel}
        checkboxChecked={alert.checkboxChecked}
        onCheckboxChange={alert.onCheckboxChange}
      />
    </div>
  );
}

export default Layout;