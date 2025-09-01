import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const QuotaStatus = ({ syncError }) => {
  const isQuotaExceeded = syncError && (
    syncError.includes('cota') || 
    syncError.includes('quota') || 
    syncError.includes('resource-exhausted')
  );

  if (!isQuotaExceeded) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4">
      <div className="flex items-start">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Cota do Firebase Excedida
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>
              Você atingiu o limite gratuito do Firebase. Os dados estão sendo salvos localmente.
            </p>
            <div className="mt-3">
              <p className="font-medium">Soluções:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Aguardar 24h para reset automático</li>
                <li>Fazer upgrade do plano Firebase</li>
                <li>Usar apenas localStorage (sem sincronização)</li>
              </ul>
            </div>
            <div className="mt-3">
              <a 
                href="https://console.firebase.google.com/project/controlfin-app/usage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:text-red-500 underline"
              >
                Verificar uso no Firebase Console →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaStatus;
