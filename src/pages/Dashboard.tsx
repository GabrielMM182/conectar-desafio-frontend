
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CustomersTable from '@/components/CustomersTable';
import { usePermissions } from '@/hooks/usePermissions';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { canDeleteCustomers, canCreateCustomers } = usePermissions();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        {/* Cards de informações do usuário */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo!</CardTitle>
              <CardDescription>
                Você está logado no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Informações do seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Status: <span className="text-green-600 font-semibold">Ativo</span></p>
                <p>Último login: Agora</p>
                <p>Sessão: Válida</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Permissões:</p>
                  <div className="space-y-1 text-sm">
                    <p>• Visualizar customers: <span className="text-green-600">✓</span></p>
                    <p>• Criar customers: {canCreateCustomers ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}</p>
                    <p>• Excluir customers: {canDeleteCustomers ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span>}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Customers */}
        <CustomersTable />
      </div>
    </div>
  );
}