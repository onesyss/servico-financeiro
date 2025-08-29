import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import Logo from '../components/Logo';


function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    houseNumber: '',
    zipCode: ''
  });



  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { alert, showError, showSuccess, hideAlert } = useAlert();

  const validatePassword = (password) => {
    const minLength = 6;
    const maxLength = 15;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return `A senha deve ter pelo menos ${minLength} caracteres.`;
    }
    if (password.length > maxLength) {
      return `A senha deve ter no máximo ${maxLength} caracteres.`;
    }
    if (!hasUpperCase) {
      return 'A senha deve conter pelo menos uma letra maiúscula.';
    }
    if (!hasLowerCase) {
      return 'A senha deve conter pelo menos uma letra minúscula.';
    }
    if (!hasNumbers) {
      return 'A senha deve conter pelo menos um número.';
    }
         if (!hasSpecialChar) {
       return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|&lt;&gt;).';
     }
    return null;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return 'Telefone deve estar no formato (11) 99999-9999';
    }
    return null;
  };

  const validateZipCode = (zipCode) => {
    const zipCodeRegex = /^\d{5}-\d{3}$/;
    if (!zipCodeRegex.test(zipCode)) {
      return 'CEP deve estar no formato 12345-678';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          showError('Por favor, preencha todos os campos.');
          return;
        }
        
        await login(formData.email, formData.password);
        showSuccess('Login realizado com sucesso!');
        navigate('/');
      } else {
        // Cadastro
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || 
            !formData.phone) {
          showError('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          showError('As senhas não coincidem.');
          return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          showError(passwordError);
          return;
        }

        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
          showError(phoneError);
          return;
        }

        const zipCodeError = validateZipCode(formData.zipCode);
        if (zipCodeError) {
          showError(zipCodeError);
          return;
        }

        await signup(formData.email, formData.password, formData.name, formData.phone, formData.state, formData.city, formData.address, formData.houseNumber, formData.zipCode);
        showSuccess('Conta criada com sucesso!');
        navigate('/');
      }
    } catch (error) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
      }
      
      showError(errorMessage);
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (numbers.length >= 7) {
        return numbers.replace(/(\d{2})(\d{4,5})/, '($1) $2');
      } else if (numbers.length >= 3) {
        return numbers.replace(/(\d{2})/, '($1)');
      }
      return numbers;
    }
    // Se exceder 11 dígitos, retorna apenas os primeiros 11 dígitos formatados
    const limitedNumbers = numbers.substring(0, 11);
    return limitedNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatZipCode = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    // Se exceder 8 dígitos, retorna apenas os primeiros 8 dígitos formatados
    const limitedNumbers = numbers.substring(0, 8);
    return limitedNumbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'zipCode') {
      formattedValue = formatZipCode(value);
    } else if (name === 'password' || name === 'confirmPassword') {
      // Limitar senhas a 15 caracteres
      formattedValue = value.substring(0, 15);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      showError('Por favor, insira seu email para recuperar a senha.');
      return;
    }

    try {
      console.log('Tentando recuperar senha para:', formData.email);
      await resetPassword(formData.email);
      showSuccess('Email de recuperação enviado! Verifique sua caixa de entrada, pasta de spam e aguarde alguns minutos.');
      setShowForgotPassword(false);
      setFormData(prev => ({ ...prev, email: '' }));
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      let errorMessage = 'Erro ao enviar email de recuperação.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email não encontrado. Verifique se o email está correto.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido. Digite um email válido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Recuperação de senha não está habilitada.';
          break;
        default:
          errorMessage = `Erro: ${error.message || error.code || 'Erro desconhecido'}`;
      }
      
      showError(errorMessage);
    }
  };



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
              {showForgotPassword ? 'Recuperar Senha' : (isLogin ? '' : 'Criar nova conta')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {showForgotPassword ? (
                <>
                  Digite seu email para receber um link de recuperação
                  <br />
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '', state: '', city: '', address: '', houseNumber: '', zipCode: '' });
                    }}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
                  >
                    ← Voltar ao login
                  </button>
                </>
              ) : (
                <>
                  {isLogin ? 'Entre com suas credenciais para acessar sua conta' : 'Preencha os dados para criar sua conta'}
                  <br />
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '', state: '', city: '', address: '', houseNumber: '', zipCode: '' });
                    }}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
                  >
                    {isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Fazer login'}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            {showForgotPassword ? (
              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                        placeholder="seu@email.com"
                      />
                      <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Enviar email de recuperação
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {!isLogin && (
                  <>
                                         <div>
                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Nome completo *
                       </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                          placeholder="Seu nome completo"
                        />
                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                                         <div>
                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Telefone *
                       </label>
                      <div className="relative">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required={!isLogin}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                          placeholder="(11) 99999-9999"
                        />
                        <PhoneIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Estado
                        </label>
                        <div className="relative">
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                            placeholder="SP"
                          />
                          <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cidade
                        </label>
                        <div className="relative">
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                            placeholder="São Paulo"
                          />
                          <BuildingOfficeIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Endereço
                        </label>
                        <div className="relative">
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                            placeholder="Rua das Flores"
                          />
                          <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Número
                        </label>
                        <div className="relative">
                          <input
                            id="houseNumber"
                            name="houseNumber"
                            type="text"
                            value={formData.houseNumber}
                            onChange={handleInputChange}
                            className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                            placeholder="123"
                          />
                          <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                                                              <div>
                       <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         CEP
                       </label>
                       <div className="relative">
                         <input
                           id="zipCode"
                           name="zipCode"
                           type="text"
                           value={formData.zipCode}
                           onChange={handleInputChange}
                           className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                           placeholder="01234-567"
                         />
                         <MapPinIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                       </div>
                     </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                      placeholder="seu@email.com"
                    />
                    <EnvelopeIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {!isLogin && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>⚠️ Atenção:</strong> O email não poderá ser alterado após o cadastro.
                      </p>
                    </div>
                  )}
                </div>

                                 <div>
                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Senha *
                   </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-4 py-3 pl-12 pr-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                                             placeholder={isLogin ? 'Sua senha' : 'Entre 6-15 caracteres com maiúscula, minúscula, número e caractere especial'}
                    />
                    <LockClosedIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {!isLogin && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">A senha deve conter:</p>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                                 <li className="flex items-center">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                           Entre 6 e 15 caracteres
                         </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Uma letra maiúscula (A-Z)
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Uma letra minúscula (a-z)
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Um número (0-9)
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          Um caractere especial (!@#$%^&*(),.?":{}|&lt;&gt;)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                                 {!isLogin && (
                   <div>
                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Confirmar senha *
                     </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                        placeholder="Confirme sua senha"
                      />
                      <LockClosedIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  {isLogin ? 'Entrar na conta' : 'Criar conta'}
                </button>

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>
                )}
              </div>
            </form>
          </>
        )}
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

export default Login;
