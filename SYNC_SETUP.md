# Sistema de Sincronização - Controle Financeiro

## Visão Geral

O sistema agora possui sincronização automática entre dispositivos usando Firebase Firestore. Quando um usuário faz login, seus dados são automaticamente sincronizados entre desktop, celular e outros dispositivos.

## Como Funciona

### 1. **Armazenamento Local (localStorage)**
- Os dados são mantidos localmente para acesso rápido
- Funciona mesmo offline
- Cache para melhor performance

### 2. **Sincronização com Firestore**
- Quando o usuário está logado, os dados são sincronizados automaticamente
- Mudanças são enviadas para o banco de dados em tempo real
- Ao fazer login em outro dispositivo, os dados são baixados automaticamente

### 3. **Indicadores Visuais**
- **Dashboard**: Mostra "Sincronizando..." quando carregando dados
- **Notificação**: Aparece no canto inferior direito mostrando status da sincronização
- **Ícones**: Diferentes ícones para upload, download e sucesso

## Funcionalidades Implementadas

### ✅ **Sincronização Automática**
- Carregamento automático ao fazer login
- Salvamento automático ao fazer mudanças
- Sincronização em tempo real

### ✅ **Indicadores de Status**
- Loading spinner durante sincronização
- Notificação de status no canto da tela
- Timestamp da última sincronização

### ✅ **Fallback Local**
- Funciona offline usando localStorage
- Dados locais são mantidos como backup
- Sincronização quando conexão retorna

### ✅ **Dados Sincronizados**
- Despesas (`expenses`)
- Dívidas (`debts`)
- Contas fixas (`fixedBills`)
- Metas de economia (`savingsGoals`)
- Contas bancárias (`bankAccounts`)
- Lançamentos financeiros (`financialEntries`)
- Saldo em conta (`accountBalance`)

## Estrutura do Banco de Dados

### Coleção: `users`
```javascript
{
  uid: "user_id",
  name: "Nome do Usuário",
  email: "email@exemplo.com",
  expenses: [...],
  debts: [...],
  fixedBills: [...],
  savingsGoals: [...],
  bankAccounts: [...],
  financialEntries: [...],
  accountBalance: {...},
  lastUpdated: timestamp,
  createdAt: timestamp
}
```

## Fluxo de Sincronização

### 1. **Login do Usuário**
```
Usuário faz login → Carrega dados do Firestore → Atualiza localStorage → Mostra indicador de sucesso
```

### 2. **Modificação de Dados**
```
Usuário modifica dados → Salva no localStorage → Envia para Firestore → Atualiza timestamp
```

### 3. **Múltiplos Dispositivos**
```
Dispositivo A: Modifica dados → Sincroniza com Firestore
Dispositivo B: Faz login → Baixa dados do Firestore → Atualiza interface
```

## Componentes Criados

### `SyncNotification`
- Mostra status da sincronização
- Ícones diferentes para cada estado
- Timestamp da última sincronização
- Posicionado no canto inferior direito

### `AppContext` (Atualizado)
- Função `loadUserData()`: Carrega dados do Firestore
- Função `saveUserData()`: Salva dados no Firestore
- Estado `isLoading`: Controla indicadores de loading
- Estado `lastSync`: Timestamp da última sincronização

## Benefícios

### 🔄 **Sincronização Multi-dispositivo**
- Dados sempre atualizados em todos os dispositivos
- Não precisa reconfigurar em cada dispositivo
- Backup automático na nuvem

### ⚡ **Performance**
- Cache local para acesso rápido
- Sincronização em background
- Funciona offline

### 🔒 **Segurança**
- Dados protegidos por autenticação Firebase
- Cada usuário vê apenas seus dados
- Backup seguro na nuvem

### 📱 **Experiência do Usuário**
- Indicadores visuais claros
- Sincronização transparente
- Não interrompe o uso do app

## Como Usar

1. **Faça login** em qualquer dispositivo
2. **Adicione/modifique** dados normalmente
3. **Faça login** em outro dispositivo
4. **Veja os dados** sincronizados automaticamente

## Troubleshooting

### Dados não sincronizam?
- Verifique se está logado
- Verifique a conexão com internet
- Aguarde alguns segundos para sincronização

### Erro de sincronização?
- Os dados locais são mantidos
- Tente fazer logout e login novamente
- Verifique o console para erros

### Perda de dados?
- Dados locais são mantidos como backup
- Firestore mantém histórico de mudanças
- Contate suporte se necessário

## Próximos Passos

- [ ] Sincronização em tempo real com Firestore listeners
- [ ] Resolução de conflitos de dados
- [ ] Backup automático periódico
- [ ] Sincronização seletiva por categoria
- [ ] Histórico de sincronização
