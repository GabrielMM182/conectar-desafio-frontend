import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface CreateCustomerDialogProps {
  onCustomerCreated: () => void;
}

interface CustomerFormData {
  razaoSocial: string;
  cnpj: string;
  nomeFachada: string;
  tags: string[];
  status: 'ativo' | 'inativo';
  conectaPlus: boolean;
}

export default function CreateCustomerDialog({ onCustomerCreated }: CreateCustomerDialogProps) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<CustomerFormData>({
    razaoSocial: '',
    cnpj: '',
    nomeFachada: '',
    tags: [],
    status: 'ativo',
    conectaPlus: false,
  });

  const handleCNPJChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    let formatted = numbers;
    if (numbers.length >= 2) {
      formatted = numbers.replace(/^(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/, (_, p1, p2, p3, p4, p5) => {
        let result = p1;
        if (p2) result += '.' + p2;
        if (p3) result += '.' + p3;
        if (p4) result += '/' + p4;
        if (p5) result += '-' + p5;
        return result;
      });
    }
    
    setFormData({ ...formData, cnpj: formatted });
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 3 && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = (): boolean => {
    if (!formData.razaoSocial.trim()) {
      setError('Razão Social é obrigatória');
      return false;
    }
    if (!formData.cnpj.trim()) {
      setError('CNPJ é obrigatório');
      return false;
    }
    if (!formData.nomeFachada.trim()) {
      setError('Nome Fachada é obrigatório');
      return false;
    }
    
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      setError('CNPJ deve ter 14 dígitos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      
      const dataToSend = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
      };

      const response = await fetch(`${apiBaseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao criar customer: ${response.status}`);
      }

      setFormData({
        razaoSocial: '',
        cnpj: '',
        nomeFachada: '',
        tags: [],
        status: 'ativo',
        conectaPlus: false,
      });

      setOpen(false);
      onCustomerCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      razaoSocial: '',
      cnpj: '',
      nomeFachada: '',
      tags: [],
      status: 'ativo',
      conectaPlus: false,
    });
    setError(null);
    setNewTag('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Customer</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo customer. Campos obrigatórios estão marcados com *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Razão Social *
              </label>
              <Input
                placeholder="Ex: Empresa Exemplo Ltda"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                CNPJ *
              </label>
              <Input
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                maxLength={18}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Nome Fachada *
              </label>
              <Input
                placeholder="Ex: Empresa Exemplo"
                value={formData.nomeFachada}
                onChange={(e) => setFormData({ ...formData, nomeFachada: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: 'ativo' | 'inativo') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Conecta Plus
            </label>
            <Select
              value={formData.conectaPlus.toString()}
              onValueChange={(value) => 
                setFormData({ ...formData, conectaPlus: value === 'true' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Não</SelectItem>
                <SelectItem value="true">Sim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Tags (máximo 3)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Digite uma tag e pressione Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={formData.tags.length >= 3}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!newTag.trim() || formData.tags.length >= 3}
              >
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            {formData.tags.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma tag adicionada
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}