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

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── ProtectedRoute.tsx  # Componente de rota protegida
│   └── Spinner.tsx         # Componente de loading
├── context/
│   └── AuthContext.tsx     # Context de autenticação
├── hooks/
│   └── useAuth.ts          # Hook personalizado
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

## Uso

### Context de Autenticação

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  // Usar as funções de autenticação
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
- Botão de logout

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