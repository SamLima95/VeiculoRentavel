import React, { useState } from 'react';
import { Car, Plus, Edit, Trash2, Search, Filter, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Veículos',
        href: '/vehicles',
    },
];

interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  plate: string;
  mileage: number;
  category: string;
  status: 'available' | 'rented' | 'maintenance';
  insurance: string;
  dailyRate: number;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    model: 'Civic',
    brand: 'Honda',
    year: 2023,
    color: 'Prata',
    plate: 'ABC-1234',
    mileage: 15000,
    category: 'Intermediário',
    status: 'available',
    insurance: 'Porto Seguro',
    dailyRate: 120
  },
  {
    id: '2',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2022,
    color: 'Branco',
    plate: 'DEF-5678',
    mileage: 25000,
    category: 'Intermediário',
    status: 'rented',
    insurance: 'Bradesco Seguros',
    dailyRate: 115
  },
  {
    id: '3',
    model: 'Gol',
    brand: 'Volkswagen',
    year: 2021,
    color: 'Azul',
    plate: 'GHI-9012',
    mileage: 45000,
    category: 'Econômico',
    status: 'maintenance',
    insurance: 'SulAmérica',
    dailyRate: 85
  },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    status: 'available',
    category: 'Econômico'
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleAddVehicle = () => {
    if (newVehicle.model && newVehicle.brand && newVehicle.plate) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        model: newVehicle.model,
        brand: newVehicle.brand,
        year: newVehicle.year || 2023,
        color: newVehicle.color || '',
        plate: newVehicle.plate,
        mileage: newVehicle.mileage || 0,
        category: newVehicle.category || 'Econômico',
        status: newVehicle.status as Vehicle['status'] || 'available',
        insurance: newVehicle.insurance || '',
        dailyRate: newVehicle.dailyRate || 0
      };
      
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({ status: 'available', category: 'Econômico' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle && newVehicle.model && newVehicle.brand && newVehicle.plate) {
      const updatedVehicles = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...newVehicle } as Vehicle
          : v
      );
      setVehicles(updatedVehicles);
      setEditingVehicle(null);
      setNewVehicle({ status: 'available', category: 'Econômico' });
    }
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Tem certeza que deseja remover este veículo?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const VehicleForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            value={newVehicle.brand || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
            placeholder="Ex: Honda"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modelo *</Label>
          <Input
            id="model"
            value={newVehicle.model || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            placeholder="Ex: Civic"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            value={newVehicle.year || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
            placeholder="2023"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <Input
            id="color"
            value={newVehicle.color || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
            placeholder="Ex: Prata"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plate">Placa *</Label>
          <Input
            id="plate"
            value={newVehicle.plate || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value.toUpperCase() })}
            placeholder="ABC-1234"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Quilometragem</Label>
          <Input
            id="mileage"
            type="number"
            value={newVehicle.mileage || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) })}
            placeholder="15000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dailyRate">Diária (R$)</Label>
          <Input
            id="dailyRate"
            type="number"
            value={newVehicle.dailyRate || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: parseFloat(e.target.value) })}
            placeholder="120.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={newVehicle.category} 
            onValueChange={(value) => setNewVehicle({ ...newVehicle, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Econômico">Econômico</SelectItem>
              <SelectItem value="Intermediário">Intermediário</SelectItem>
              <SelectItem value="Executivo">Executivo</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={newVehicle.status} 
            onValueChange={(value) => setNewVehicle({ ...newVehicle, status: value as Vehicle['status'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="rented">Locado</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurance">Seguradora</Label>
        <Input
          id="insurance"
          value={newVehicle.insurance || ''}
          onChange={(e) => setNewVehicle({ ...newVehicle, insurance: e.target.value })}
          placeholder="Ex: Porto Seguro"
        />
      </div>
    </div>
  );

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
                <DialogDescription>
                  Preencha as informações do veículo
                </DialogDescription>
              </DialogHeader>
              <VehicleForm />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddVehicle} className="bg-blue-600 hover:bg-blue-700">
                  Salvar Veículo
                </Button>
              </div>
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
                  <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'available').length}</p>
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
                  <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'rented').length}</p>
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
                  <p className="text-xl font-bold">{vehicles.filter(v => v.status === 'maintenance').length}</p>
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
                  <p className="text-xl font-bold">{vehicles.length}</p>
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
            <CardTitle>Lista de Veículos ({filteredVehicles.length})</CardTitle>
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
                  {filteredVehicles.map((vehicle) => (
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
                      <TableCell>R$ {vehicle.dailyRate}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Veículo</DialogTitle>
              <DialogDescription>
                Atualize as informações do veículo
              </DialogDescription>
            </DialogHeader>
            <VehicleForm />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingVehicle(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateVehicle} className="bg-blue-600 hover:bg-blue-700">
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
