import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CustomersTable() {
  const {
    customers,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
  } = useCustomers();

  const [searchForm, setSearchForm] = useState<{
    razaoSocial: string;
    cnpj: string;
    status: 'ativo' | 'inativo' | 'all';
    conectaPlus: boolean | 'all';
  }>({
    razaoSocial: filters.razaoSocial || '',
    cnpj: filters.cnpj || '',
    status: filters.status || 'all',
    conectaPlus: filters.conectaPlus === '' ? 'all' : filters.conectaPlus || 'all',
  });

  const handleSearch = () => {
    updateFilters({
      razaoSocial: searchForm.razaoSocial,
      cnpj: searchForm.cnpj,
      status: searchForm.status === 'all' ? '' : searchForm.status,
      conectaPlus: searchForm.conectaPlus === 'all' ? '' : searchForm.conectaPlus,
      page: 1, 
    });
  };

  const handleReset = () => {
    setSearchForm({
      razaoSocial: '',
      cnpj: '',
      status: 'all',
      conectaPlus: 'all',
    });
    resetFilters();
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar customers: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Razão Social
              </label>
              <Input
                placeholder="Buscar por razão social..."
                value={searchForm.razaoSocial}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, razaoSocial: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">CNPJ</label>
              <Input
                placeholder="00.000.000/0000-00"
                value={searchForm.cnpj}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, cnpj: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={searchForm.status}
                onValueChange={(value) =>
                  setSearchForm({ ...searchForm, status: value as 'ativo' | 'inativo' | 'all' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Conecta Plus
              </label>
              <Select
                value={searchForm.conectaPlus === 'all' ? 'all' : searchForm.conectaPlus.toString()}
                onValueChange={(value) =>
                  setSearchForm({
                    ...searchForm,
                    conectaPlus: value === 'all' ? 'all' : value === 'true' ? true : false,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              Buscar
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {/* Tabela */}
        {!loading && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Nome Fachada</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Conecta Plus</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Nenhum customer encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.id}
                        </TableCell>
                        <TableCell>{customer.razaoSocial}</TableCell>
                        <TableCell>{formatCNPJ(customer.cnpj)}</TableCell>
                        <TableCell>{customer.nomeFachada}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              customer.status === 'ativo' ? 'success' : 'warning'
                            }
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={customer.conectaPlus ? 'default' : 'outline'}
                          >
                            {customer.conectaPlus ? 'Sim' : 'Não'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                  de {pagination.total} resultados
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={
                          pagination.page <= 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        const current = pagination.page;
                        return (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= current - 1 && page <= current + 1)
                        );
                      })
                      .map((page, index, array) => (
                        <PaginationItem key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === pagination.page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={
                          pagination.page >= pagination.totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}