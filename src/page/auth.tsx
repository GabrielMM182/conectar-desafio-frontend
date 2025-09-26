import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, loading, user, accessToken } = useAuth();

  useEffect(() => {
    if (user && accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, accessToken, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('access_token', token);
      window.location.href = '/dashboard';
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'login' 
              ? 'Digite suas credenciais para acessar sua conta'
              : 'Preencha os dados para criar sua conta'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Carregando...
                </div>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar Conta'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              Entrar com Google
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={toggleMode}
            disabled={loading}
          >
            {mode === 'login' 
              ? 'Não tem uma conta? Criar conta'
              : 'Já tem uma conta? Fazer login'
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
