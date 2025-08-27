# 🔥 Configuração do Firebase

## 📋 Passos para configurar o Firebase:

### 1. Criar projeto no Firebase Console
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Digite o nome do projeto (ex: "controlfin-app")
4. Siga os passos de configuração

### 2. Habilitar Authentication
1. No console do Firebase, vá em "Authentication"
2. Clique em "Get started"
3. Vá na aba "Sign-in method"
4. Habilite "Email/Password"
5. Clique em "Save"

### 3. Configurar Firestore Database
1. No console do Firebase, vá em "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)

### 4. Obter configuração do projeto
1. No console do Firebase, clique na engrenagem ⚙️
2. Selecione "Project settings"
3. Role até "Your apps"
4. Clique no ícone da web (</>)
5. Digite um nome para o app (ex: "controlfin-web")
6. Clique em "Register app"
7. Copie a configuração que aparece

### 5. Atualizar arquivo de configuração
1. Abra o arquivo `src/firebase/config.js`
2. Substitua a configuração de exemplo pelos seus dados:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 6. Configurar regras do Firestore
1. No console do Firebase, vá em "Firestore Database"
2. Clique na aba "Rules"
3. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Testar o sistema
1. Execute `npm start`
2. Acesse `http://localhost:3000`
3. Você será redirecionado para `/login`
4. Crie uma conta e teste o sistema

## 🔒 Segurança

As regras do Firestore garantem que:
- ✅ Cada usuário só acessa seus próprios dados
- ✅ Usuários não autenticados não podem acessar dados
- ✅ Dados ficam isolados por usuário

## 📱 Sincronização

Após a configuração:
- ✅ Dados sincronizados entre dispositivos
- ✅ Login persistente
- ✅ Backup automático na nuvem
- ✅ Cada usuário tem seus dados separados

## 🚨 Importante

- **Nunca compartilhe** suas chaves do Firebase
- **Use HTTPS** em produção
- **Configure domínios autorizados** no console do Firebase
- **Monitore o uso** para evitar cobranças inesperadas

## 💰 Custos

Firebase tem um **plano gratuito generoso**:
- 50.000 leituras/dia
- 20.000 escritas/dia
- 20.000 exclusões/dia
- 1GB de armazenamento

Para uso pessoal, dificilmente você ultrapassará esses limites.
