import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';


function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { alert, showError, showSuccess, hideAlert } = useAlert();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    houseNumber: '',
    zipCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        address: currentUser.address || '',
        houseNumber: currentUser.houseNumber || '',
        zipCode: currentUser.zipCode || ''
      }));


    }
  }, [currentUser]);

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
    } else if (name === 'currentPassword' || name === 'newPassword' || name === 'confirmPassword') {
      // Limitar senhas a 15 caracteres
      formattedValue = value.substring(0, 15);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleUpdateProfile = async () => {
    if (!formData.displayName.trim()) {
      showError('O nome não pode estar vazio.');
      return;
    }

    try {
      await updateProfile(currentUser, {
        displayName: formData.displayName.trim()
      });

      // Atualizar dados adicionais no Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: formData.displayName.trim(),
        phone: formData.phone,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        houseNumber: formData.houseNumber,
        zipCode: formData.zipCode
      });
      
      showSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      showError('Erro ao atualizar perfil. Tente novamente.');
    }
  };

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

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      showError('Por favor, preencha todos os campos de senha.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    try {
      // Reautenticar o usuário
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Atualizar a senha
      await updatePassword(currentUser, formData.newPassword);
      
      showSuccess('Senha alterada com sucesso!');
      setIsChangingPassword(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        showError('Senha atual incorreta.');
      } else {
        showError('Erro ao alterar senha. Tente novamente.');
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // Implementar exclusão da conta
      showError('Funcionalidade de exclusão de conta será implementada em breve.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Perfil</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas informações pessoais</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Perfil */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Informações Pessoais
          </h2>
          
          <div className="space-y-4">
            <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Nome completo
               </label>
              <div className="relative">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                                     placeholder="Seu nome completo"
                />
                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

                         <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Email
               </label>
               <div className="relative">
                 <input
                   type="email"
                   name="email"
                   value={formData.email}
                   disabled
                   className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                   placeholder="seu@email.com"
                 />
                 <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                 O email não pode ser alterado
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Telefone
               </label>
               <div className="relative">
                 <input
                   type="tel"
                   name="phone"
                   value={formData.phone}
                   onChange={handleInputChange}
                   disabled={!isEditing}
                   className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                   placeholder="(11) 99999-9999"
                 />
                 <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
               </div>
             </div>

                           <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                                     <div className="relative">
                     <input
                       type="text"
                       name="state"
                       value={formData.state}
                       onChange={handleInputChange}
                       disabled={!isEditing}
                       className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                       placeholder="SP"
                     />
                     <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cidade
                  </label>
                                     <div className="relative">
                     <input
                       type="text"
                       name="city"
                       value={formData.city}
                       onChange={handleInputChange}
                       disabled={!isEditing}
                       className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                       placeholder="São Paulo"
                     />
                     <BuildingOfficeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                   </div>
                </div>
              </div>

                           <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Endereço
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      placeholder="Rua das Flores"
                    />
                    <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Número
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      placeholder="123"
                    />
                    <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 CEP
               </label>
               <div className="relative">
                 <input
                   type="text"
                   name="zipCode"
                   value={formData.zipCode}
                   onChange={handleInputChange}
                   disabled={!isEditing}
                   className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                   placeholder="01234-567"
                 />
                 <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
               </div>
             </div>

            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(prev => ({
                        ...prev,
                        displayName: currentUser?.displayName || ''
                      }));
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Alterar Senha
          </h2>
          
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Alterar Senha
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha atual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Sua senha atual"
                  />
                  <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                                                   placeholder="Entre 6-15 caracteres com maiúscula, minúscula, número e caractere especial"
                  />
                  <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <p>A nova senha deve conter:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                                                                           <li>Entre 6 e 15 caracteres</li>
                  <li>Uma letra maiúscula (A-Z)</li>
                  <li>Uma letra minúscula (a-z)</li>
                  <li>Um número (0-9)</li>
                                     <li>Um caractere especial (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Confirme a nova senha"
                  />
                  <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Configurações
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Confirmação de Logout
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrar confirmação antes de sair do sistema
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('skipLogoutConfirm');
                showSuccess('Configuração resetada! A confirmação de logout será exibida novamente.');
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Resetar
            </button>
          </div>
        </div>
      </div>

      {/* Excluir Conta */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
          Zona de Perigo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Uma vez que você exclua sua conta, não há como voltar atrás. Tenha certeza.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Excluir Conta
        </button>
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

export default Profile;
