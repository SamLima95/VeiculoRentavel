import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Car, Plus, Edit, Trash2, Search, Filter, Wrench, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign, Gauge, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Veículos',
        href: '/vehicles',
    },
];

interface Vehicle {
  id: number;
  model: string;
  brand: string;
  year: number;
  color: string;
  plate: string;
  mileage: number;
  category: string;
  status: 'available' | 'rented' | 'maintenance';
  insurance_data?: {
    name?: string;
    number?: string;
    expiry_date?: string;
  } | null;
  daily_rate: number;
  notes?: string | null;
}

interface VehiclesPageProps {
  vehicles: {
    data: Vehicle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
  };
  filters: {
    search?: string;
    status?: string;
    category?: string;
  };
}

export default function Vehicles({ vehicles: vehiclesPaginated, filters: initialFilters }: VehiclesPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilters?.status || 'all');
  const [plateAvailability, setPlateAvailability] = useState<{ available: boolean; message: string } | null>(null);

  // Form para criação
  const createForm = useForm({
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    mileage: 0,
    category: 'Econômico',
    status: 'available' as const,
    daily_rate: 0,
    insurance_data: null,
    notes: '',
  });

  // Form para edição
  const editForm = useForm({
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    mileage: 0,
    category: 'Econômico',
    status: 'available' as const,
    daily_rate: 0,
    insurance_data: null,
    notes: '',
  });

  // Debounce para busca
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Atualizar busca quando debouncedSearch mudar
  React.useEffect(() => {
    if (debouncedSearch !== undefined) {
      router.get('/vehicles', 
        { search: debouncedSearch || '', status: statusFilter !== 'all' ? statusFilter : '', ...initialFilters },
        { preserveState: true, replace: true }
      );
    }
  }, [debouncedSearch]);

  // Atualizar quando filtro de status mudar
  React.useEffect(() => {
    router.get('/vehicles', 
      { search: searchTerm || '', status: statusFilter !== 'all' ? statusFilter : '', ...initialFilters },
      { preserveState: true, replace: true }
    );
  }, [statusFilter]);

  // Debounce para placa
  const [plateInput, setPlateInput] = useState('');
  const debouncedPlate = useDebounce(plateInput, 500);

  // Verificar disponibilidade de placa em tempo real
  const checkPlateAvailability = useCallback(async (plate: string, excludeVehicleId?: number) => {
    if (!plate || plate.length < 7) {
      setPlateAvailability(null);
      return;
    }

    try {
      const response = await fetch(`/vehicles/check-plate?plate=${encodeURIComponent(plate)}${excludeVehicleId ? `&vehicle_id=${excludeVehicleId}` : ''}`);
      const data = await response.json();
      setPlateAvailability(data);
    } catch (error) {
      console.error('Erro ao verificar placa:', error);
    }
  }, []);

  // Verificar placa quando debounced mudar
  React.useEffect(() => {
    if (debouncedPlate) {
      checkPlateAvailability(debouncedPlate, editingVehicle?.id);
    } else {
      setPlateAvailability(null);
    }
  }, [debouncedPlate, editingVehicle?.id, checkPlateAvailability]);

  const handleCreateVehicle = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    createForm.post('/vehicles', {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        createForm.reset();
        setPlateAvailability(null);
        setPlateInput('');
      },
    });
  }, [createForm]);

  const handleUpdateVehicle = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    editForm.put(`/vehicles/${editingVehicle.id}`, {
      onSuccess: () => {
        setEditingVehicle(null);
        editForm.reset();
        setPlateAvailability(null);
        setPlateInput('');
      },
    });
  }, [editForm, editingVehicle]);

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    if (confirm(`Tem certeza que deseja inativar o veículo ${vehicle.brand} ${vehicle.model} (${vehicle.plate})?`)) {
      router.delete(`/vehicles/${vehicle.id}`, {
        preserveScroll: true,
      });
    }
  };

  const openEditDialog = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    editForm.setData({
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      color: vehicle.color,
      plate: vehicle.plate,
      mileage: vehicle.mileage,
      category: vehicle.category,
      status: vehicle.status,
      daily_rate: vehicle.daily_rate,
      insurance_data: vehicle.insurance_data,
      notes: vehicle.notes || '',
    });
    setPlateInput(vehicle.plate);
    setPlateAvailability(null);
  }, [editForm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Locado</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = useMemo(() => {
    const data = vehiclesPaginated?.data || [];
    return {
      available: data.filter(v => v.status === 'available').length,
      rented: data.filter(v => v.status === 'rented').length,
      maintenance: data.filter(v => v.status === 'maintenance').length,
      total: vehiclesPaginated?.total || 0,
    };
  }, [vehiclesPaginated]);

  // Componente de formulário memoizado para evitar re-renderizações desnecessárias
  const VehicleForm = React.useMemo(() => {
    return ({ form, isEdit = false }: { form: typeof createForm; isEdit?: boolean }) => {
    const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const plate = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      form.setData('plate', plate);
      setPlateInput(plate);
    };

    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('brand', e.target.value);
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('model', e.target.value);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('year', parseInt(e.target.value) || new Date().getFullYear());
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('color', e.target.value);
    };

    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('mileage', parseInt(e.target.value) || 0);
    };

    const handleDailyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setData('daily_rate', parseFloat(e.target.value) || 0);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      form.setData('notes', e.target.value);
    };

    const handleCategoryChange = (value: string) => {
      form.setData('category', value);
    };

    const handleStatusChange = (value: string) => {
      form.setData('status', value as 'available' | 'rented' | 'maintenance');
    };

    const handleCancel = () => {
      if (isEdit) {
        setEditingVehicle(null);
        editForm.reset();
      } else {
        setIsAddDialogOpen(false);
        createForm.reset();
      }
      setPlateAvailability(null);
      setPlateInput('');
    };

    return (
      <form onSubmit={isEdit ? handleUpdateVehicle : handleCreateVehicle} className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Car className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Marca *
              </Label>
              <Input
                id="brand"
                value={form.data.brand || ''}
                onChange={handleBrandChange}
                placeholder="Ex: Honda, Toyota, Ford"
                className="h-10"
                required
              />
              <InputError message={form.errors.brand} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                Modelo *
              </Label>
              <Input
                id="model"
                value={form.data.model || ''}
                onChange={handleModelChange}
                placeholder="Ex: Civic, Corolla, Fiesta"
                className="h-10"
                required
              />
              <InputError message={form.errors.model} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Ano *
              </Label>
              <Input
                id="year"
                type="number"
                value={form.data.year || ''}
                onChange={handleYearChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="h-10"
                required
              />
              <InputError message={form.errors.year} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium">Cor *</Label>
              <Input
                id="color"
                value={form.data.color || ''}
                onChange={handleColorChange}
                placeholder="Ex: Prata, Branco, Preto"
                className="h-10"
                required
              />
              <InputError message={form.errors.color} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate" className="text-sm font-medium">Placa *</Label>
              <div className="space-y-1">
                <Input
                  id="plate"
                  value={form.data.plate || ''}
                  onChange={handlePlateChange}
                  placeholder="ABC1234"
                  maxLength={8}
                  className="h-10 font-mono text-lg tracking-wider uppercase"
                  required
                />
                {plateAvailability && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    plateAvailability.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {plateAvailability.available ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>{plateAvailability.message}</span>
                  </div>
                )}
              </div>
              <InputError message={form.errors.plate} />
            </div>
          </div>
        </div>

        {/* Informações Técnicas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Gauge className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Informações Técnicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm font-medium flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                Quilometragem (Km) *
              </Label>
              <Input
                id="mileage"
                type="number"
                value={form.data.mileage || ''}
                onChange={handleMileageChange}
                placeholder="15000"
                min="0"
                className="h-10"
                required
              />
              <InputError message={form.errors.mileage} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily_rate" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Valor da Diária (R$) *
              </Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                value={form.data.daily_rate || ''}
                onChange={handleDailyRateChange}
                placeholder="120.00"
                min="0"
                className="h-10"
                required
              />
              <InputError message={form.errors.daily_rate} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Categoria *</Label>
              <Select 
                value={form.data.category || ''} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Econômico">Econômico</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Executivo">Executivo</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={form.errors.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
              <Select 
                value={form.data.status || ''} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="rented">Locado</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={form.errors.status} />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Observações</h3>
          </div>
          <div className="space-y-2 pt-2">
            <Label htmlFor="notes" className="text-sm font-medium">Observações Gerais</Label>
            <Textarea
              id="notes"
              value={form.data.notes || ''}
              onChange={handleNotesChange}
              placeholder="Informações adicionais sobre o veículo, condições especiais, histórico, etc."
              rows={4}
              className="resize-none"
            />
            <InputError message={form.errors.notes} />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
            disabled={form.processing}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            disabled={form.processing || (plateAvailability && !plateAvailability.available && !isEdit)}
          >
            {form.processing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Salvando...
              </span>
            ) : (
              isEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'
            )}
          </Button>
        </div>
      </form>
    );
    };
  }, [plateAvailability, handleCreateVehicle, handleUpdateVehicle, editingVehicle, editForm, createForm]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Veículos" />
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1>Gestão de Veículos</h1>
            <p className="text-muted-foreground">
              Gerencie a frota de veículos da locadora
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              createForm.reset();
              setPlateAvailability(null);
              setPlateInput('');
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Cadastrar Novo Veículo</DialogTitle>
                <DialogDescription className="text-base">
                  Preencha todas as informações necessárias para cadastrar um novo veículo na frota
                </DialogDescription>
              </DialogHeader>
              <VehicleForm form={createForm} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                  <p className="text-xl font-bold">{stats.available}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Locados</p>
                  <p className="text-xl font-bold">{stats.rented}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Manutenção</p>
                  <p className="text-xl font-bold">{stats.maintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por modelo, marca ou placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="rented">Locado</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Veículos ({vehiclesPaginated?.total || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Km</TableHead>
                    <TableHead>Diária</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiclesPaginated?.data?.length > 0 ? (
                    vehiclesPaginated.data.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                            <div className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.color}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{vehicle.plate}</TableCell>
                        <TableCell>{vehicle.category}</TableCell>
                        <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                        <TableCell>R$ {vehicle.daily_rate.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(vehicle)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Nenhum veículo encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {vehiclesPaginated && vehiclesPaginated.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {vehiclesPaginated.per_page * (vehiclesPaginated.current_page - 1) + 1} a{' '}
                  {Math.min(vehiclesPaginated.per_page * vehiclesPaginated.current_page, vehiclesPaginated.total)} de{' '}
                  {vehiclesPaginated.total} veículos
                </div>
                <div className="flex gap-2">
                  {vehiclesPaginated.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`px-3 py-2 rounded-md text-sm ${
                        link.active
                          ? 'bg-blue-600 text-white'
                          : link.url
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingVehicle} onOpenChange={(open) => {
          if (!open) {
            setEditingVehicle(null);
            editForm.reset();
            setPlateAvailability(null);
            setPlateInput('');
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Editar Veículo</DialogTitle>
              <DialogDescription className="text-base">
                Atualize as informações do veículo conforme necessário
              </DialogDescription>
            </DialogHeader>
            <VehicleForm form={editForm} isEdit={true} />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
