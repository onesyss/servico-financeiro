import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { 
  applyActionCode,
  checkActionCode
} from 'firebase/auth';
import { auth } from '../firebase/config';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import Logo from '../components/Logo';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { alert, showError, showSuccess, hideAlert } = useAlert();
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [oobCode, setOobCode] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      verifyCode(code);
    } else {
      setVerifying(false);
      showError('Link de verificação inválido ou expirado.');
    }
  }, [searchParams]);

  const verifyCode = async (code) => {
    try {
      console.log('Verificando código de verificação de email...');
      const actionCodeInfo = await checkActionCode(auth, code);
      console.log('Código válido!', actionCodeInfo);
      
      // Extrair email do código
      if (actionCodeInfo.data && actionCodeInfo.data.email) {
        setEmail(actionCodeInfo.data.email);
      }
      
      setVerifying(false);
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setVerifying(false);
      showError('Link de verificação inválido ou expirado. Solicite um novo link.');
    }
  };

  const handleConfirmEmail = async () => {
    setLoading(true);
    
    try {
      console.log('Confirmando verificação de email...');
      await applyActionCode(auth, oobCode);
      console.log('Email verificado com sucesso!');
      showSuccess('Email verificado com sucesso! Redirecionando para o login...');
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erro ao confirmar email:', error);
      let errorMessage = 'Erro ao verificar email.';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Link de verificação expirado. Solicite um novo link.';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Link de verificação inválido. Solicite um novo link.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta foi desabilitada.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        default:
          errorMessage = `Erro: ${error.message || error.code || 'Erro desconhecido'}`;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
              <div className="flex justify-center mb-6">
                <Logo size="large" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Verificando link...
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Aguarde enquanto verificamos seu link de verificação.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="large" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verificar Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Confirme seu endereço de email para continuar usando o ControlFin
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Email Válido!
              </h3>
              
              {email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>{email}</strong>
                </p>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Seu link de verificação é válido. Clique no botão abaixo para confirmar seu email.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleConfirmEmail}
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Confirmar Email
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center items-center py-2 px-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Voltar ao login
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Importante
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Este link é válido por 1 hora
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Após a verificação, você poderá fazer login normalmente
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Se você não solicitou esta verificação, ignore este link
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Alerta */}
      <Alert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        onClose={hideAlert}
      />
    </div>
  );
}

export default EmailVerification;
