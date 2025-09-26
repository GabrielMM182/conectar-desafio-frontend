import { useAuth } from '@/context/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const canDeleteCustomers = () => {
    return isAdmin();
  };

  const canCreateCustomers = () => {
    return isAdmin();
  };

  return {
    isAdmin: isAdmin(),
    canDeleteCustomers: canDeleteCustomers(),
    canCreateCustomers: canCreateCustomers(),
  };
}