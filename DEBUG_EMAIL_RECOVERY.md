# 🔍 Debug da Recuperação de Email

## 🚨 **Problema Reportado:**
"ao recuperar e-mail ele não está achando o email sendo que ele está cadastrado"

## 🔧 **Melhorias Implementadas:**

### **1. Logs Detalhados**
- ✅ Logs mais detalhados na função `resetPassword`
- ✅ Verificação de email limpo (trim + lowercase)
- ✅ Logs separados para cada etapa do processo

### **2. Verificação Dupla**
- ✅ Verificação no Firebase Auth
- ✅ Verificação no Firestore
- ✅ Fallback para segunda tentativa

### **3. Tratamento de Erros Melhorado**
- ✅ Captura de erros específicos
- ✅ Mensagens de debug mais claras
- ✅ Stack trace completo

## 🧪 **Como Testar:**

### **1. Abrir DevTools**
1. Pressione `F12` no navegador
2. Vá para a aba **Console**
3. Limpe o console (Ctrl+L)

### **2. Testar Recuperação**
1. Vá para a página de login
2. Clique em "Esqueceu sua senha?"
3. Digite o email que você sabe que está cadastrado
4. Clique em "Enviar email de recuperação"

### **3. Verificar Logs**
Procure por estas mensagens no console:

```
=== INÍCIO DA RECUPERAÇÃO DE SENHA ===
Email fornecido: [seu-email]
Email limpo: [seu-email-limpo]
Tentando enviar email de recuperação diretamente...
```

## 🔍 **Possíveis Cenários:**

### **Cenário 1: Email não encontrado no Auth**
```
❌ Erro ao enviar email: auth/user-not-found
Usuário não encontrado no Auth, verificando...
Verificando email no Firestore: [email]
Documentos encontrados no Firestore: 0
```

### **Cenário 2: Email encontrado no Firestore mas não no Auth**
```
❌ Erro ao enviar email: auth/user-not-found
Usuário não encontrado no Auth, verificando...
Verificando email no Firestore: [email]
Documentos encontrados no Firestore: 1
✅ Email encontrado, tentando novamente...
```

### **Cenário 3: Email encontrado em ambos**
```
✅ Email de recuperação enviado com sucesso!
```

## 🛠️ **Soluções Possíveis:**

### **Se o email não for encontrado:**

1. **Verificar se o usuário foi criado corretamente:**
   - O usuário deve estar no Firebase Auth
   - O documento deve estar no Firestore

2. **Verificar configurações do Firebase:**
   - Authentication > Sign-in method > Email/Password deve estar habilitado
   - "Allow users to reset their password" deve estar marcado

3. **Verificar se o email está correto:**
   - Verificar se não há espaços extras
   - Verificar se o domínio está correto

### **Se o email for encontrado mas ainda falhar:**

1. **Verificar configurações de email:**
   - Firebase Console > Authentication > Templates
   - Configurar template de email personalizado

2. **Verificar domínios autorizados:**
   - Firebase Console > Authentication > Settings
   - Adicionar `localhost` aos domínios autorizados

## 📋 **Checklist de Debug:**

- [ ] Console do navegador aberto (F12)
- [ ] Email digitado corretamente
- [ ] Usuário existe no sistema
- [ ] Firebase configurado corretamente
- [ ] Recuperação de senha habilitada
- [ ] Domínios autorizados configurados
- [ ] Template de email configurado

## 🆘 **Se ainda não funcionar:**

1. **Copie os logs completos** do console
2. **Verifique o email exato** que está sendo usado
3. **Confirme se o usuário consegue fazer login** normalmente
4. **Teste com um email diferente** para comparar

## 📞 **Informações para Suporte:**

Quando reportar o problema, inclua:
- Logs completos do console
- Email usado no teste
- Se o usuário consegue fazer login
- Configurações do Firebase Console
- Erro específico mostrado na interface
