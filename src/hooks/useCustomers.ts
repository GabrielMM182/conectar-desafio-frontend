import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface Customer {
  id: number;
  razaoSocial: string;
  cnpj: string;
  nomeFachada: string;
  tags: string[];
  status: 'ativo' | 'inativo';
  conectaPlus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomersFilters {
  page: number;
  limit: number;
  razaoSocial?: string;
  cnpj?: string;
  status?: 'ativo' | 'inativo' | '';
  conectaPlus?: boolean | '' | undefined;
}

export function useCustomers() {
  const { accessToken } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<CustomersFilters>({
    page: 1,
    limit: 10,
    razaoSocial: '',
    cnpj: '',
    status: '',
    conectaPlus: '',
  });

  const fetchCustomers = async (currentFilters: CustomersFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('page', currentFilters.page.toString());
      params.append('limit', currentFilters.limit.toString());
      
      if (currentFilters.razaoSocial) {
        params.append('razaoSocial', currentFilters.razaoSocial);
      }
      if (currentFilters.cnpj) {
        params.append('cnpj', currentFilters.cnpj);
      }
      if (currentFilters.status) {
        params.append('status', currentFilters.status);
      }
      if (currentFilters.conectaPlus !== '' && currentFilters.conectaPlus !== undefined) {
        params.append('conectaPlus', currentFilters.conectaPlus.toString());
      }

      if (!accessToken) {
        throw new Error('Token de autenticação não encontrado');
      }

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiBaseUrl}/customers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar customers: ${response.status}`);
      }

      const data: CustomersResponse = await response.json();
      
      setCustomers(data.data);
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<CustomersFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchCustomers(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: CustomersFilters = {
      page: 1,
      limit: 10,
      razaoSocial: '',
      cnpj: '',
      status: '',
      conectaPlus: '',
    };
    setFilters(defaultFilters);
    fetchCustomers(defaultFilters);
  };

  useEffect(() => {
    if (accessToken) {
      fetchCustomers(filters);
    }
  }, [accessToken]);

  return {
    customers,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    refetch: () => fetchCustomers(filters),
  };
}