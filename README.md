# ControlFin - Sistema de Controle Financeiro Pessoal

Um aplicativo web para gerenciamento de finanças pessoais, desenvolvido com React e Tailwind CSS.

## Funcionalidades

- Dashboard para visualização de gastos mensais
- Controle de dívidas e gastos
- Gerenciamento de contas fixas
- Sugestões de economia
- Armazenamento local de dados

## Tecnologias Utilizadas

- React
- Tailwind CSS
- Chart.js para visualização de dados
- Armazenamento local com localStorage

## Como executar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

## Deploy no Netlify

### Opção 1: Deploy direto do GitHub

1. Faça o push do código para um repositório GitHub
2. Acesse [Netlify](https://www.netlify.com/) e faça login
3. Clique em "New site from Git"
4. Selecione GitHub como provedor Git
5. Autorize o Netlify a acessar seu GitHub
6. Selecione o repositório do projeto
7. Configure as opções de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
8. Clique em "Deploy site"

### Opção 2: Deploy manual

1. Construa o projeto localmente:
   ```bash
   npm run build
   ```
2. Acesse [Netlify](https://www.netlify.com/) e faça login
3. Vá para a seção "Sites"
4. Arraste e solte a pasta `dist` na área designada

## Configuração

O arquivo `netlify.toml` já está configurado com as seguintes definições:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm start"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Esta configuração garante que:
- O comando correto seja usado para build
- O diretório correto seja publicado
- As rotas do React Router funcionem corretamente com redirecionamento para index.html