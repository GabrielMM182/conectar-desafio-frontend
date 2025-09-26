# Sistema de Autenticação React

Sistema completo de autenticação em React com TypeScript, React Router e Context API, utilizando componentes shadcn/ui.

## Funcionalidades

-  Login e registro de usuários
-  Autenticação via Google OAuth
-  Gerenciamento de estado global com Context API
-  Rotas protegidas
-  Persistência de token no localStorage
-  Interface responsiva com shadcn/ui
-  Validação de formulários
-  Tratamento de erros
-  Loading states
-  **Sistema de roles e permissões (admin/user)**
-  **Tabela de Customers com filtros e paginação**
-  **Busca por razão social, CNPJ, status e Conecta Plus**
-  **Exibição de tags, status e datas formatadas**
-  **CRUD completo de Customers (Create, Read, Delete)**
-  **Diálogos modais para criação e exclusão**
-  **Validação e formatação automática de CNPJ**
-  **Sistema de tags com limite máximo (3 tags)**
-  **Controle de permissões baseado em roles**

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   │   ├── badge.tsx       # Componente Badge
│   │   ├── table.tsx       # Componente Table
│   │   ├── pagination.tsx  # Componente Pagination
│   │   ├── dialog.tsx      # Componente Dialog
│   │   ├── select.tsx      # Componente Select
│   │   └── ...
│   ├── ProtectedRoute.tsx        # Componente de rota protegida
│   ├── CustomersTable.tsx        # Tabela de customers
│   ├── CreateCustomerDialog.tsx  # Modal para criar customers
│   ├── DeleteCustomerDialog.tsx  # Modal para excluir customers
│   └── Spinner.tsx               # Componente de loading
├── context/
│   └── AuthContext.tsx     # Context de autenticação
├── hooks/
│   ├── useAuth.ts          # Hook de autenticação
│   ├── useCustomers.ts     # Hook de customers
│   └── usePermissions.ts   # Hook de permissões e roles
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

[![Captura 6](https://i.ibb.co/yjqS7Kd/Captura-de-Tela-2025-09-26-a-s-12-14-49.png)](https://ibb.co/GSRTNGn)

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

[![Captura 7](https://i.ibb.co/gMbG4PKn/Captura-de-Tela-2025-09-26-a-s-12-14-52.png)](https://ibb.co/N6gXTmB4)


### Perfil do Usuário
```
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "role": "admin" // ou "user"
}
```

[![Captura 1](https://i.ibb.co/PzT5Fxb5/Captura-de-Tela-2025-09-26-a-s-11-58-21.png)](https://ibb.co/4gsjKWDj)


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


[![Captura 3](https://i.ibb.co/MDrdGWNF/Captura-de-Tela-2025-09-26-a-s-11-58-44.png)](https://ibb.co/27xJsmKG)


#### Query Parameters:
- `page` - Número da página (default: 1)
- `limit` - Itens por página (default: 10)
- `razaoSocial` - Busca parcial por razão social
- `cnpj` - Busca exata por CNPJ
- `status` - Filtro por status (`ativo` ou `inativo`)
- `conectaPlus` - Filtro por Conecta Plus (`true` ou `false`)


[![Captura 2](https://i.ibb.co/MD1GVLRL/Captura-de-Tela-2025-09-26-a-s-11-58-32.png)](https://ibb.co/WWzPy1c1)

### Criação de Customer
```
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "razaoSocial": "Nova Empresa Ltda",
  "cnpj": "12345678000190",
  "nomeFachada": "Nova Empresa",
  "tags": ["tecnologia", "inovação"],
  "status": "ativo",
  "conectaPlus": false
}
```


[![Captura 5](https://i.ibb.co/fd7n5gFK/Captura-de-Tela-2025-09-26-a-s-11-58-57.png)](https://ibb.co/yFJY19PM)



### Exclusão de Customer
```
DELETE /customers/:id
Authorization: Bearer <token>
```

[![Captura 4](https://i.ibb.co/L26HVgY/Captura-de-Tela-2025-09-26-a-s-11-58-50.png)](https://ibb.co/tWcFV2Q)

## CRUD de Customers

### Criação de Customer
- Modal responsivo com validação completa
- Campos obrigatórios: Razão Social, CNPJ, Nome Fachada
- Formatação automática de CNPJ (XX.XXX.XXX/XXXX-XX)
- Sistema de tags com limite de 3 tags por customer
- Seleção de status (ativo/inativo) e Conecta Plus
- Validação de CNPJ (14 dígitos obrigatórios)

### Exclusão de Customer
- Modal de confirmação com dados do customer
- Disponível apenas para usuários admin
- Operação irreversível com aviso claro
- Atualização automática da tabela após exclusão

### Funcionalidades da Tabela
- Busca em tempo real por razão social e CNPJ
- Filtros por status e Conecta Plus
- Paginação com navegação completa
- Formatação automática de datas e CNPJ
- Tags exibidas como badges coloridos
- Controle de permissões integrado

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

## Sistema de Permissões

O sistema implementa controle de acesso baseado em roles:

### Roles Disponíveis
- **admin**: Acesso completo (criar, visualizar, excluir customers)
- **user**: Acesso limitado (apenas visualizar customers)

### Controle de Permissões
- Verificação automática de permissões na interface
- Botões de ação exibidos apenas para usuários autorizados
- Validação no backend para todas as operações
- Feedback visual das permissões no dashboard

### Implementação
```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { canCreateCustomers, canDeleteCustomers, isAdmin } = usePermissions();
  
  return (
    <div>
      {canCreateCustomers && <CreateButton />}
      {canDeleteCustomers && <DeleteButton />}
    </div>
  );
}
```

## Fluxo de Autenticação

1. **Acesso inicial:** Usuário é redirecionado para `/auth`
2. **Login/Registro:** Formulário com validação e tratamento de erros
3. **Google OAuth:** Redirecionamento para endpoint do Google
4. **Callback:** Token recebido via query parameter
5. **Dashboard:** Acesso às áreas protegidas com verificação de role
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
- Exibe informações do usuário com role
- **Tabela de customers com funcionalidades completas**
- **Sistema de permissões visível na interface**
- **Controle de acesso baseado em roles**
- Botão de logout

### CustomersTable
- Tabela responsiva com todos os dados dos customers
- Filtros por razão social, CNPJ, status e Conecta Plus
- Paginação completa com navegação
- Formatação automática de CNPJ e datas
- Exibição de tags como badges
- Status coloridos (ativo/inativo)
- **Botões de ação (criar/excluir) baseados em permissões**
- **Integração com modais de CRUD**
- Loading states e tratamento de erros

### useCustomers Hook
- Gerenciamento de estado dos customers
- Funções de busca com filtros
- Controle de paginação
- Cache e otimização de requisições

### CreateCustomerDialog
- Modal responsivo para criação de customers
- Validação completa de formulário
- Formatação automática de CNPJ
- Sistema de tags com limite máximo
- Controle de status e Conecta Plus
- Tratamento de erros e loading states

### DeleteCustomerDialog
- Modal de confirmação para exclusão
- Exibição dos dados do customer
- Tratamento de erros
- Controle de permissões

### usePermissions Hook
- Controle de permissões baseado em roles
- Verificação de permissões para CRUD
- Integração com sistema de autenticação

## Tecnologias Utilizadas

- React 19
- TypeScript
- React Router DOM
- Axios
- shadcn/ui (Dialog, Select, Badge, Table, Pagination)
- Tailwind CSS
- Vite
- Lucide React (ícones)
- Context API para gerenciamento de estado

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter