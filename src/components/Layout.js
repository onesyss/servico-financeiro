import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ClipboardDocumentListIcon, 
  ArrowTrendingUpIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Despesas', path: '/expenses', icon: CreditCardIcon },
    { name: 'Dívidas', path: '/debts', icon: BanknotesIcon },
    { name: 'Contas Fixas', path: '/fixed-bills', icon: ClipboardDocumentListIcon },
    { name: 'Economia', path: '/savings', icon: ArrowTrendingUpIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para mobile */}
      <div className={`
        fixed inset-0 z-40 lg:hidden
        ${sidebarOpen ? 'block' : 'hidden'}
      `}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white border-r border-gray-200">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <span className="text-xl font-semibold text-primary-600">ControlFin</span>
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
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
                onClick={toggleSidebar}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <span className="text-xl font-semibold text-primary-600">ControlFin</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white lg:px-6">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 lg:hidden hover:text-gray-700 hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="lg:hidden">
            <span className="text-lg font-semibold text-primary-600">ControlFin</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">Olá, Usuário</span>
          </div>
        </header>

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;