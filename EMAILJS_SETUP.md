# Configuração do EmailJS para o Sistema de Suporte

## O que é o EmailJS?

O EmailJS é um serviço que permite enviar emails diretamente do frontend JavaScript sem precisar de um backend. É perfeito para formulários de contato como o que implementamos no sistema de suporte.

## Passos para Configurar

### 1. Criar conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Faça login na sua conta

### 2. Configurar o Serviço de Email

1. No dashboard do EmailJS, vá em "Email Services"
2. Clique em "Add New Service"
3. Selecione "Gmail" como provedor
4. Conecte sua conta Gmail (marlon.oymi@gmail.com)
5. Anote o **Service ID** gerado

### 3. Criar Template de Email

1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template com o seguinte conteúdo:

**Assunto:**
```
Suporte ControlFin - {{subject}}
```

**Corpo do Email:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Suporte ControlFin</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nova Mensagem de Suporte - ControlFin
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Informações do Usuário</h3>
            <p><strong>Nome:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> {{from_email}}</p>
            <p><strong>Assunto:</strong> {{subject}}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #1e40af;">Mensagem</h3>
            <p style="white-space: pre-wrap;">{{message}}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
            <p><strong>Data:</strong> {{date}}</p>
            <p><strong>Hora:</strong> {{time}}</p>
        </div>
    </div>
</body>
</html>
```

4. Salve o template e anote o **Template ID**

### 4. Obter User ID

1. Vá em "Account" no menu lateral
2. Na seção "API Keys", copie o **Public Key** (User ID)

### 5. Atualizar o Código

Substitua os valores no arquivo `src/pages/Support.js`:

```javascript
// Linha 25 - useEffect
emailjs.init("SEU_USER_ID_AQUI");

// Linha 75-79 - emailjs.send
await emailjs.send(
  'SEU_SERVICE_ID_AQUI', // Service ID do Gmail
  'SEU_TEMPLATE_ID_AQUI', // Template ID criado
  templateParams,
  'SEU_USER_ID_AQUI' // User ID (Public Key)
);
```

## Limites da Conta Gratuita

- **200 emails por mês** (suficiente para testes e uso pessoal)
- **2 templates de email**
- **1 serviço de email**

## Testando

1. Após configurar, acesse a página de Suporte no sistema
2. Preencha o formulário com seus dados
3. Clique em "Enviar Mensagem"
4. Verifique se o email chegou em marlon.oymi@gmail.com

## Soluções Alternativas

Se preferir não usar EmailJS, você pode:

1. **Usar um backend próprio** com Node.js + Nodemailer
2. **Usar SendGrid** (mais profissional, mas requer backend)
3. **Usar Netlify Forms** (se hospedar no Netlify)
4. **Usar Formspree** (alternativa ao EmailJS)

## Segurança

- O EmailJS é seguro para formulários de contato
- Os dados são enviados via HTTPS
- Não armazena informações sensíveis
- Ideal para projetos pequenos e médios

## Suporte

Se tiver problemas com a configuração:
- [Documentação oficial do EmailJS](https://www.emailjs.com/docs/)
- [Fórum da comunidade](https://community.emailjs.com/)
- [Exemplos de templates](https://www.emailjs.com/examples/)
