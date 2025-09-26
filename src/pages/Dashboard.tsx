
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

export default function Dashboard() {
  const { user, logout } = useAuth();

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
              <CardDescription>
                O que você pode fazer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  Editar Perfil
                </Button>
                <Button className="w-full" variant="outline">
                  Configurações
                </Button>
                <Button className="w-full" variant="outline">
                  Ajuda
                </Button>
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