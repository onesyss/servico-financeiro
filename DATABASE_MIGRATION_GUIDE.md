# Guia de Migração para MongoDB Atlas

## 1. Configuração do MongoDB Atlas

### Passo 1: Criar Conta
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Escolha o plano **M0 Sandbox** (gratuito)

### Passo 2: Criar Cluster
1. Clique em "Build a Database"
2. Escolha **M0 Sandbox** (gratuito)
3. Selecione uma região próxima (ex: São Paulo)
4. Nome do cluster: `controlfin-cluster`

### Passo 3: Configurar Acesso
1. Crie um usuário de banco:
   - Username: `controlfin-user`
   - Password: (senha forte)
2. Configure IP Whitelist:
   - Adicione `0.0.0.0/0` (permite acesso de qualquer IP)

### Passo 4: Obter String de Conexão
1. Clique em "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Exemplo: `mongodb+srv://controlfin-user:<password>@controlfin-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## 2. Instalação das Dependências

```bash
npm install mongodb
# ou
npm install mongoose
```

## 3. Configuração no Projeto

### Opção A: MongoDB Driver Nativo
```javascript
// src/database/mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'sua-string-de-conexao';
const MONGODB_DB = 'controleFin';

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
```

### Opção B: Mongoose (Mais Fácil)
```javascript
// src/database/mongoose.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'sua-string-de-conexao';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

## 4. Modelos de Dados

### Usando Mongoose:
```javascript
// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  expenses: [{ 
    id: Number,
    description: String,
    amount: Number,
    date: Date,
    category: String
  }],
  debts: [{
    id: Number,
    description: String,
    amount: Number,
    dueDate: Date,
    isPaid: Boolean
  }],
  bankAccounts: [{
    id: Number,
    name: String,
    institution: String,
    balance: Number,
    color: String,
    isDefault: Boolean
  }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
```

## 5. API Routes (Next.js)

```javascript
// pages/api/user/[id].js
import connectDB from '../../../src/database/mongoose';
import User from '../../../src/models/User';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ email: id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const user = await User.findOneAndUpdate(
        { email: id },
        { ...req.body, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## 6. Migração dos Dados

### Script de Migração:
```javascript
// scripts/migrate-to-mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'sua-string-de-conexao';
const client = new MongoClient(MONGODB_URI);

async function migrateData() {
  try {
    await client.connect();
    const db = client.db('controleFin');
    const users = db.collection('users');

    // Migrar dados do localStorage para MongoDB
    const localData = JSON.parse(localStorage.getItem('controlfin_expenses'));
    
    await users.insertOne({
      email: 'seu-email@exemplo.com',
      expenses: localData,
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    console.log('Migração concluída!');
  } catch (error) {
    console.error('Erro na migração:', error);
  } finally {
    await client.close();
  }
}

migrateData();
```

## 7. Vantagens do MongoDB Atlas

### ✅ **Gratuito e Generoso:**
- 512MB de armazenamento
- Sem limite de operações
- Backup automático
- Suporte 24/7

### ✅ **Fácil de Usar:**
- Interface web intuitiva
- Documentação excelente
- Integração simples com React

### ✅ **Escalável:**
- Pode crescer conforme necessário
- Planos pagos acessíveis
- Performance excelente

### ✅ **Seguro:**
- Criptografia em trânsito
- Backup automático
- Controle de acesso granular

## 8. Comparação com Firebase

| Recurso | Firebase | MongoDB Atlas |
|---------|----------|---------------|
| **Armazenamento Gratuito** | 1GB | 512MB |
| **Operações Gratuitas** | 50k reads/dia | Ilimitadas |
| **Backup** | Manual | Automático |
| **Escalabilidade** | Limitada | Excelente |
| **Custo** | $25/mês após limite | $9/mês após limite |

## 9. Próximos Passos

1. **Criar conta** no MongoDB Atlas
2. **Configurar cluster** gratuito
3. **Instalar dependências** no projeto
4. **Implementar modelos** de dados
5. **Migrar dados** existentes
6. **Testar sincronização**

## 10. Suporte

- [Documentação MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) (cursos gratuitos)
