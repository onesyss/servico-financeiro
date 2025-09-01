import React from 'react';
import { useAuth } from '../context/AuthContext';

const SyncDebug = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs">
      <h4 className="font-semibold mb-2">Debug de Sincronização</h4>
      <div className="space-y-1">
        <p><strong>E-mail:</strong> {currentUser.email}</p>
        <p><strong>UID:</strong> {currentUser.uid}</p>
        <p><strong>Verificado:</strong> {currentUser.emailVerified ? 'Sim' : 'Não'}</p>
        <p><strong>Último Login:</strong> {currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString('pt-BR') : 'N/A'}</p>
      </div>
    </div>
  );
};

export default SyncDebug;
