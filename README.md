# Sistema de Autenticação React

Sistema completo de autenticação em React com TypeScript, React Router e Context API, utilizando componentes shadcn/ui.

## Funcionalidades

- ✅ Login e registro de usuários
- ✅ Autenticação via Google OAuth
- ✅ Gerenciamento de estado global com Context API
- ✅ Rotas protegidas
- ✅ Persistência de token no localStorage
- ✅ Interface responsiva com shadcn/ui
- ✅ Validação de formulários
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ **Tabela de Customers com filtros e paginação**
- ✅ **Busca por razão social, CNPJ, status e Conecta Plus**
- ✅ **Exibição de tags, status e datas formatadas**

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   │   ├── badge.tsx       # Componente Badge
│   │   ├── table.tsx       # Componente Table
│   │   ├── pagination.tsx  # Componente Pagination
│   │   └── ...
│   ├── ProtectedRoute.tsx  # Componente de rota protegida
│   ├── CustomersTable.tsx  # Tabela de customers
│   └── Spinner.tsx         # Componente de loading
├── context/
│   └── AuthContext.tsx     # Context de autenticação
├── hooks/
│   ├── useAuth.ts          # Hook de autenticação
│   └── useCustomers.ts     # Hook de customers
├── pages/
│   └── Dashboard.tsx       # Página do dashboard
├── page/
│   └── auth.tsx           # Página de autenticação
└── routes/
    └── index.tsx          # Configuração das rotas
```

## Configuração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com a URL da sua API:
```
VITE_API_BASE_URL=http://localhost:3000
```

3. **Executar o projeto:**
```bash
npm run dev
```

## API Endpoints

O sistema espera os seguintes endpoints na API:

### Registro
```
POST /auth/register
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Login Google
```
GET /auth/google
```
Redireciona para: `FRONTEND_URL/auth/callback?token=<jwt>`

### Perfil do Usuário
```
GET /auth/profile
Authorization: Bearer <token>
```

### Listagem de Customers
```
GET /customers?page=1&limit=10&status=ativo&razaoSocial=empresa
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "id": 1,
      "razaoSocial": "Empresa Exemplo Ltda",
      "cnpj": "12.345.678/0001-90",
      "nomeFachada": "Empresa Exemplo",
      "tags": ["tecnologia", "startup", "b2b"],
      "status": "ativo",
      "conectaPlus": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### Query Parameters:
- `page` - Número da página (default: 1)
- `limit` - Itens por página (default: 10)
- `razaoSocial` - Busca parcial por razão social
- `cnpj` - Busca exata por CNPJ
- `status` - Filtro por status (`ativo` ou `inativo`)
- `conectaPlus` - Filtro por Conecta Plus (`true` ou `false`)

## Uso

### Context de Autenticação

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
}
```

### Rotas Protegidas

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Fluxo de Autenticação

1. **Acesso inicial:** Usuário é redirecionado para `/auth`
2. **Login/Registro:** Formulário com validação e tratamento de erros
3. **Google OAuth:** Redirecionamento para endpoint do Google
4. **Callback:** Token recebido via query parameter
5. **Dashboard:** Acesso às áreas protegidas
6. **Persistência:** Token salvo no localStorage

## Componentes Principais

### AuthContext
- Gerencia estado global de autenticação
- Funções: login, register, loginWithGoogle, logout, getProfile
- Persistência automática do token

### AuthPage
- Interface única para login e registro
- Alternância entre modos via botão
- Integração com Google OAuth
- Validação e tratamento de erros

### ProtectedRoute
- Componente wrapper para rotas protegidas
- Redirecionamento automático se não autenticado

### Dashboard
- Página principal após autenticação
- Exibe informações do usuário
- **Tabela de customers com funcionalidades completas**
- Botão de logout

### CustomersTable
- Tabela responsiva com todos os dados dos customers
- Filtros por razão social, CNPJ, status e Conecta Plus
- Paginação completa com navegação
- Formatação automática de CNPJ e datas
- Exibição de tags como badges
- Status coloridos (ativo/inativo)
- Loading states e tratamento de erros

### useCustomers Hook
- Gerenciamento de estado dos customers
- Funções de busca com filtros
- Controle de paginação
- Cache e otimização de requisições

## Tecnologias Utilizadas

- React 19
- TypeScript
- React Router DOM
- Axios
- shadcn/ui
- Tailwind CSS
- Vite

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter