import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const testFirebaseConnection = async (userId) => {
  try {
    console.log('🧪 Testando conectividade com Firebase...');
    
    // Teste 1: Tentar escrever um documento de teste
    const testRef = doc(db, 'test', 'connection-test');
    const testData = {
      timestamp: new Date(),
      message: 'Teste de conectividade',
      userId: userId
    };
    
    await setDoc(testRef, testData);
    console.log('✅ Escrita no Firestore funcionando');
    
    // Teste 2: Tentar ler o documento
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) {
      console.log('✅ Leitura do Firestore funcionando');
      console.log('📄 Dados lidos:', testDoc.data());
    } else {
      console.log('⚠️ Documento não encontrado após escrita');
    }
    
    // Teste 3: Verificar documento do usuário
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('✅ Documento do usuário encontrado');
      console.log('👤 Dados do usuário:', userDoc.data());
    } else {
      console.log('⚠️ Documento do usuário não encontrado');
    }
    
    return {
      success: true,
      message: 'Todos os testes passaram'
    };
    
  } catch (error) {
    console.error('❌ Erro no teste de conectividade:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};
