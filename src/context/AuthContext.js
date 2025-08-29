import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para cadastrar usuário
  const signup = async (email, password, name, phone, state, city, address, houseNumber, zipCode) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Criar documento inicial do usuário no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        phone: phone || '',
        state: state || '',
        city: city || '',
        address: address || '',
        houseNumber: houseNumber || '',
        zipCode: zipCode || '',
        createdAt: new Date(),
        expenses: [],
        debts: [],
        fixedBills: [],
        savingsGoals: [],
        accountBalance: {
          currentBalance: 0,
          transactions: []
        }
      });

      // Enviar email de verificação
      try {
        await userCredential.user.sendEmailVerification({
          url: `${window.location.origin}/verify-email`,
          handleCodeInApp: true
        });
        console.log('Email de verificação enviado com sucesso!');
      } catch (verificationError) {
        console.error('Erro ao enviar email de verificação:', verificationError);
        // Não falhar o cadastro se o email de verificação falhar
      }

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Função para fazer logout
  const logout = () => {
    return signOut(auth);
  };

  // Função para recuperar senha
  const resetPassword = async (email) => {
    try {
      console.log('=== INÍCIO DA RECUPERAÇÃO DE SENHA ===');
      console.log('Email fornecido:', email);
      console.log('Auth configurado:', !!auth);
      console.log('Auth domain:', auth.config?.authDomain);
      
      // Verificar se o email é válido
      if (!email || !email.includes('@')) {
        console.log('Email inválido detectado');
        throw new Error('Email inválido');
      }
      
      // Limpar espaços em branco do email
      const cleanEmail = email.trim().toLowerCase();
      console.log('Email limpo:', cleanEmail);
      
      // Tentar enviar email diretamente primeiro
      console.log('Tentando enviar email de recuperação diretamente...');
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true
      };
      
      try {
        await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
        console.log('✅ Email de recuperação enviado com sucesso!');
        return true;
      } catch (sendError) {
        console.log('❌ Erro ao enviar email:', sendError.code, sendError.message);
        
                 // Se o erro for user-not-found, tentar verificar métodos de login e Firestore
         if (sendError.code === 'auth/user-not-found') {
           console.log('Usuário não encontrado no Auth, verificando...');
           
           // Verificar no Firestore primeiro
           const existsInFirestore = await checkEmailInFirestore(cleanEmail);
           console.log('Email existe no Firestore:', existsInFirestore);
           
           // Verificar métodos de login
           try {
             const signInMethods = await fetchSignInMethodsForEmail(auth, cleanEmail);
             console.log('Métodos de login encontrados:', signInMethods);
             
             if (signInMethods.length === 0 && !existsInFirestore) {
               console.log('❌ Email não encontrado em nenhum lugar');
               throw new Error('auth/user-not-found');
             } else if (signInMethods.length > 0 || existsInFirestore) {
               console.log('✅ Email encontrado, tentando novamente...');
               // Tentar novamente
               await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
               console.log('✅ Email enviado na segunda tentativa!');
               return true;
             } else {
               throw new Error('auth/user-not-found');
             }
           } catch (verifyError) {
             console.log('❌ Erro na verificação:', verifyError);
             throw sendError; // Usar o erro original
           }
         } else {
           throw sendError;
         }
      }
    } catch (error) {
      console.error('=== ERRO NA RECUPERAÇÃO DE SENHA ===');
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      console.error('Stack trace:', error.stack);
      
      // Se o erro não tem código, mas é nosso erro customizado
      if (error.message === 'auth/user-not-found') {
        const customError = new Error('User not found');
        customError.code = 'auth/user-not-found';
        throw customError;
      }
      
      throw error;
    }
  };



  // Função para obter dados do usuário
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  };

  // Função para verificar se um email existe no Firestore
  const checkEmailInFirestore = async (email) => {
    try {
      console.log('Verificando email no Firestore:', email);
      // Buscar por email na coleção de usuários
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      console.log('Documentos encontrados no Firestore:', querySnapshot.size);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar email no Firestore:', error);
      return false;
    }
  };

  // Observar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      setLoading(false);
    });



    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
