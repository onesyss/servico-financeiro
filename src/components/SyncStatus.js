import React from 'react';
import { CloudArrowUpIcon, CloudArrowDownIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SyncStatus = ({ isLoading, lastSync, syncError, syncRetryCount }) => {
  const getStatusIcon = () => {
    if (syncError) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
    }
    
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      );
    }
    
    if (lastSync) {
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    }
    
    return <CloudArrowDownIcon className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (syncError) {
      return `Erro na sincronização${syncRetryCount > 0 ? ` (${syncRetryCount} tentativas)` : ''}`;
    }
    
    if (isLoading) {
      return 'Sincronizando...';
    }
    
    if (lastSync) {
      return 'Sincronizado';
    }
    
    return 'Não sincronizado';
  };

  const getStatusColor = () => {
    if (syncError) {
      return 'text-red-600 dark:text-red-400';
    }
    
    if (isLoading) {
      return 'text-blue-600 dark:text-blue-400';
    }
    
    if (lastSync) {
      return 'text-green-600 dark:text-green-400';
    }
    
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {lastSync && !isLoading && !syncError && (
        <span className="text-xs text-gray-500 dark:text-gray-500">
          ({lastSync.toLocaleString('pt-BR')})
        </span>
      )}
    </div>
  );
};

export default SyncStatus;
