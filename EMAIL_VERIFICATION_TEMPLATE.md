# 📧 Template de Email para Verificação de Email

## 🔧 **Configurar Template no Firebase Console:**

### **1. Acessar o Console do Firebase**
- Vá para [console.firebase.google.com](https://console.firebase.google.com)
- Selecione seu projeto `controlfin-app`

### **2. Configurar Templates de Email**
- No menu lateral, clique em **"Authentication"**
- Clique na aba **"Templates"**
- Selecione **"Email verification"**

### **3. Configurar Template Personalizado**

#### **Configurações Básicas:**
- **Sender name**: `ControlFin`
- **Subject**: `Verifique seu email - ControlFin`
- **Reply-to**: Seu email de suporte

#### **Template HTML Personalizado:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar Email - ControlFin</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            color: #1f2937;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .content {
            margin-bottom: 30px;
        }
        .message {
            color: #374151;
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 25px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .verify-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            transition: all 0.3s ease;
        }
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
        }
        .warning-title {
            color: #92400e;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .warning-text {
            color: #78350f;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .features {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .features-title {
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-item {
            color: #374151;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        .feature-item:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }
            .title {
                font-size: 24px;
            }
            .logo {
                font-size: 20px;
                padding: 12px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">💰 ControlFin</div>
            <h1 class="title">Verifique seu email</h1>
            <p class="subtitle">Controle suas finanças de forma inteligente</p>
        </div>

        <div class="content">
            <p class="message">
                Olá! 👋<br><br>
                Obrigado por se cadastrar no <strong>ControlFin</strong>! Para começar a usar nossa plataforma, precisamos verificar seu endereço de email.
            </p>

            <div class="button-container">
                <a href="{{LINK}}" class="verify-button">
                    ✉️ Verificar Meu Email
                </a>
            </div>

            <div class="warning">
                <div class="warning-title">⚠️ Importante</div>
                <div class="warning-text">
                    • Este link é válido por 1 hora<br>
                    • Se você não se cadastrou no ControlFin, ignore este email<br>
                    • Nunca compartilhe este link com outras pessoas
                </div>
            </div>

            <div class="features">
                <div class="features-title">🎯 O que você pode fazer no ControlFin?</div>
                <ul class="feature-list">
                    <li class="feature-item">Controle total de suas despesas e receitas</li>
                    <li class="feature-item">Acompanhamento de dívidas e contas fixas</li>
                    <li class="feature-item">Metas de economia personalizadas</li>
                    <li class="feature-item">Relatórios detalhados e insights</li>
                    <li class="feature-item">Interface moderna e intuitiva</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>
                <strong>ControlFin</strong> - Sua ferramenta completa de controle financeiro<br>
                Este email foi enviado automaticamente, não responda a esta mensagem.<br>
                Em caso de dúvidas, entre em contato conosco.
            </p>
        </div>
    </div>
</body>
</html>
```

#### **Template de Texto Simples (Alternativo):**
```
💰 ControlFin - Verifique seu email

Olá! 👋

Obrigado por se cadastrar no ControlFin! Para começar a usar nossa plataforma, precisamos verificar seu endereço de email.

✉️ Para verificar seu email, clique no link abaixo:
{{LINK}}

⚠️ IMPORTANTE:
• Este link é válido por 1 hora
• Se você não se cadastrou no ControlFin, ignore este email
• Nunca compartilhe este link com outras pessoas

🎯 O que você pode fazer no ControlFin?
✓ Controle total de suas despesas e receitas
✓ Acompanhamento de dívidas e contas fixas
✓ Metas de economia personalizadas
✓ Relatórios detalhados e insights
✓ Interface moderna e intuitiva

ControlFin - Sua ferramenta completa de controle financeiro

Este email foi enviado automaticamente, não responda a esta mensagem.
Em caso de dúvidas, entre em contato conosco.
```

### **4. Configurar URL de Redirecionamento**
- **Action URL**: `https://seu-dominio.com/verify-email` (quando estiver em produção)
- **Continue URL**: Deixe como padrão (o Firebase gerencia automaticamente)

### **5. Configurações Adicionais**
- **Default from**: Configure um email de suporte
- **Reply-to**: Seu email de suporte
- **Support email**: Seu email de suporte

## 🎨 **Personalização do Template:**

### **Cores do Projeto:**
- **Primária**: `#667eea` (azul/roxo)
- **Secundária**: `#764ba2` (roxo)
- **Sucesso**: `#10b981` (verde)
- **Aviso**: `#f59e0b` (amarelo)

### **Elementos Visuais:**
- ✅ Logo do ControlFin com ícone de dinheiro
- ✅ Gradiente moderno nos botões
- ✅ Ícones emoji para melhor UX
- ✅ Design responsivo
- ✅ Cores consistentes com o projeto

### **Conteúdo:**
- ✅ Mensagem amigável e clara
- ✅ Instruções de segurança
- ✅ Destaque para os benefícios do app
- ✅ Informações de contato

## 🚀 **Teste do Template:**

1. **Configure o template** no Firebase Console
2. **Crie uma nova conta** no app
3. **Verifique o email** recebido
4. **Teste o link** de verificação
5. **Confirme** que redireciona para a página personalizada

## 📧 **Configurações de Email:**

### **Domínios Autorizados:**
- `localhost` (desenvolvimento)
- `seu-dominio.com` (produção)

### **Configurações de Segurança:**
- ✅ SPF record configurado
- ✅ DKIM configurado
- ✅ DMARC configurado

## 🔧 **Troubleshooting:**

### **Email não chega:**
1. Verificar configurações de domínio
2. Verificar pasta de spam
3. Aguardar alguns minutos

### **Link não funciona:**
1. Verificar URL de redirecionamento
2. Verificar domínios autorizados
3. Verificar configuração do template

### **Template não aparece:**
1. Salvar configurações no Firebase
2. Aguardar propagação (pode levar alguns minutos)
3. Verificar se está usando o template correto
