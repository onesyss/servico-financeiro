import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { testFirebaseConnection } from '../utils/firebaseTest';

const SyncTest = () => {
  const { forceSync, bankAccounts, addBankAccount, lastSync } = useAppContext();
  const { currentUser } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [testAccount, setTestAccount] = useState({
    name: 'Conta Teste',
    bank: 'Banco Teste',
    institution: 'Instituição Teste',
    balance: '1000',
    color: '#FF0000'
  });

  const addTestAccount = () => {
    addBankAccount(testAccount);
    console.log('Conta de teste adicionada:', testAccount);
  };

  const testSync = async () => {
    console.log('Iniciando teste de sincronização...');
    await forceSync();
  };

  const testConnection = async () => {
    if (!currentUser) return;
    
    const result = await testFirebaseConnection(currentUser.uid);
    setTestResult(result);
    console.log('Resultado do teste:', result);
  };

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg text-xs border border-yellow-300 dark:border-yellow-700">
      <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Teste de Sincronização</h4>
      <div className="space-y-2">
        <p><strong>Contas atuais:</strong> {bankAccounts.length}</p>
        <p><strong>Última sincronização:</strong> {lastSync ? lastSync.toLocaleString('pt-BR') : 'Nunca'}</p>
        
        <div className="flex space-x-2 mt-3">
          <button
            onClick={addTestAccount}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Adicionar Conta Teste
          </button>
          
          <button
            onClick={testSync}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            Forçar Sincronização
          </button>
          
          <button
            onClick={testConnection}
            className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
          >
            Testar Conexão
          </button>
        </div>
        
        {testResult && (
          <div className={`mt-2 p-2 rounded text-xs ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <strong>Resultado do teste:</strong> {testResult.success ? testResult.message : testResult.error}
          </div>
        )}
        
        <p className="text-yellow-700 dark:text-yellow-300 mt-2">
          <strong>Instruções:</strong> Adicione uma conta teste e force a sincronização. 
          Depois verifique no outro dispositivo se a conta aparece.
        </p>
      </div>
    </div>
  );
};

export default SyncTest;
