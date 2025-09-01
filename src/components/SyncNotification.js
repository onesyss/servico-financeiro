import React from 'react';
import { CloudArrowUpIcon, CloudArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SyncNotification = ({ isLoading, lastSync, syncStatus }) => {
  if (!isLoading && !lastSync) return null;

  const getStatusIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      );
    }
    
    if (syncStatus === 'success') {
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    }
    
    if (syncStatus === 'uploading') {
      return <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />;
    }
    
    if (syncStatus === 'downloading') {
      return <CloudArrowDownIcon className="h-4 w-4 text-blue-600" />;
    }
    
    return null;
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Sincronizando dados...';
    }
    
    if (syncStatus === 'success') {
      return 'Dados sincronizados';
    }
    
    if (syncStatus === 'uploading') {
      return 'Enviando dados...';
    }
    
    if (syncStatus === 'downloading') {
      return 'Baixando dados...';
    }
    
    return '';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3">
        {getStatusIcon()}
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {getStatusText()}
        </span>
        {lastSync && !isLoading && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(lastSync).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default SyncNotification;
