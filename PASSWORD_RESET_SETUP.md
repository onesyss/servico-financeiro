# Configuração da Recuperação de Senha no Firebase

## 🔧 **Passos para habilitar a recuperação de senha:**

### **1. Acessar o Console do Firebase**
- Vá para [console.firebase.google.com](https://console.firebase.google.com)
- Selecione seu projeto `controlfin-app`

### **2. Habilitar Authentication**
- No menu lateral, clique em **"Authentication"**
- Clique na aba **"Sign-in method"**

### **3. Configurar Email/Password Provider**
- Clique em **"Email/Password"** na lista de provedores
- Certifique-se de que está **Enabled**
- Marque a opção **"Allow users to reset their password"**

### **4. Configurar Templates de Email**
- No menu lateral, clique em **"Authentication"**
- Clique na aba **"Templates"**
- Selecione **"Password reset"**
- Configure:
  - **Sender name**: ControlFin
  - **Subject**: Redefinir sua senha - ControlFin
  - **Message**: Use o template personalizado do arquivo `EMAIL_TEMPLATE_SETUP.md`
  - **Action URL**: Deixe como padrão (Firebase gerencia automaticamente)

### **5. Configurar Domínios Autorizados**
- No Firebase Console > Authentication > Settings
- Na seção **"Authorized domains"**, certifique-se de que inclui:
  - `localhost` (para desenvolvimento)
  - Seu domínio de produção (quando disponível)

### **6. Verificar Configurações de Email**
- No Firebase Console > Authentication > Settings
- Na seção **"Email templates"**, verifique:
  - **Default from**: deve estar configurado
  - **Reply-to**: pode ser seu email de suporte

## 🚨 **Problemas comuns e soluções:**

### **Email não chega:**
1. **Verificar pasta de spam/lixo eletrônico**
2. **Verificar se o email está correto**
3. **Aguardar alguns minutos** (pode haver delay)

### **Erro: "user-not-found"**
- **Causa**: Email não existe no sistema
- **Solução**: Verificar se o email está correto ou criar conta primeiro

### **Erro: "too-many-requests"**
- **Causa**: Muitas tentativas em pouco tempo
- **Solução**: Aguardar alguns minutos antes de tentar novamente

### **Erro: "operation-not-allowed"**
- **Causa**: Recuperação de senha não habilitada
- **Solução**: Habilitar no Firebase Console

### **Erro: "invalid-email"**
- **Causa**: Formato de email inválido
- **Solução**: Verificar formato do email

## 📝 **Logs para debug:**

O sistema agora inclui logs detalhados. Abra o DevTools (F12) e verifique:

### **Console logs esperados:**
```
Iniciando recuperação de senha para: usuario@email.com
Auth configurado: true
Auth domain: controlfin-app.firebaseapp.com
Enviando email de recuperação...
Email de recuperação enviado com sucesso!
```

### **Se houver erro:**
```
Erro detalhado na recuperação de senha: [erro]
Código do erro: auth/user-not-found
Mensagem do erro: There is no user record corresponding to this identifier.
```

## 🔍 **Verificação rápida:**

1. **Firebase Console > Authentication > Sign-in method > Email/Password** deve estar **Enabled**
2. **"Allow users to reset their password"** deve estar marcado
3. **Firebase Console > Authentication > Templates > Password reset** deve estar configurado
4. **Domínios autorizados** devem incluir `localhost`
5. **Console do navegador** deve mostrar logs detalhados

## 📧 **Teste prático:**

1. Execute o projeto localmente
2. Vá para a página de login
3. Clique em "Esqueceu sua senha?"
4. Digite um email válido que existe no sistema
5. Clique em "Enviar email de recuperação"
6. Verifique o console do navegador para logs
7. Verifique a caixa de entrada e pasta de spam
8. Clique no link do email para acessar a página de redefinição
9. Teste a redefinição de senha com a nova interface

## 🛠️ **Configuração adicional (opcional):**

### **Personalizar template de email:**
Consulte o arquivo `EMAIL_TEMPLATE_SETUP.md` para templates completos e personalizados com:
- ✅ Design moderno e responsivo
- ✅ Cores do projeto ControlFin
- ✅ Mensagem em português
- ✅ Instruções de segurança
- ✅ Destaque para benefícios do app

### **Configurar email de suporte:**
- No Firebase Console > Authentication > Settings
- Configure **"Support email"** com seu email de suporte
