import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clients',
    },
];

interface Client {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  lastRental?: string;
  totalRentals: number;
}

interface Rental {
  id: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    cpf: '123.456.789-00',
    cnh: '12345678901',
    phone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    address: {
      street: 'Rua das Flores, 123, Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    status: 'active',
    createdAt: '2024-01-15',
    lastRental: '2024-03-10',
    totalRentals: 5
  },
  {
    id: '2',
    name: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    cnh: '98765432100',
    phone: '(11) 88888-8888',
    email: 'maria.oliveira@email.com',
    address: {
      street: 'Av. Paulista, 1000, Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    status: 'active',
    createdAt: '2024-02-20',
    lastRental: '2024-03-15',
    totalRentals: 3
  }
];

const mockRentals: Record<string, Rental[]> = {
  '1': [
    {
      id: '1',
      vehicle: 'Honda Civic - ABC-1234',
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      totalAmount: 600,
      status: 'Concluída'
    },
    {
      id: '2',
      vehicle: 'Toyota Corolla - DEF-5678',
      startDate: '2024-02-05',
      endDate: '2024-02-08',
      totalAmount: 345,
      status: 'Concluída'
    }
  ],
  '2': [
    {
      id: '3',
      vehicle: 'VW Gol - GHI-9012',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      totalAmount: 255,
      status: 'Concluída'
    }
  ]
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    status: 'active',
    address: {}
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const validateCNH = (cnh: string) => {
    const cleanCNH = cnh.replace(/\D/g, '');
    return cleanCNH.length === 11;
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddClient = () => {
    if (newClient.name && newClient.cpf && newClient.cnh && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        cpf: newClient.cpf,
        cnh: newClient.cnh,
        phone: newClient.phone || '',
        email: newClient.email,
        address: newClient.address || {},
        status: newClient.status as Client['status'] || 'active',
        createdAt: new Date().toISOString().split('T')[0],
        totalRentals: 0
      } as Client;
      
      setClients([...clients, client]);
      setNewClient({ status: 'active', address: {} });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient(client);
  };

  const handleUpdateClient = () => {
    if (editingClient && newClient.name && newClient.cpf && newClient.cnh && newClient.email) {
      const updatedClients = clients.map(c => 
        c.id === editingClient.id 
          ? { ...editingClient, ...newClient } as Client
          : c
      );
      setClients(updatedClients);
      setEditingClient(null);
      setNewClient({ status: 'active', address: {} });
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const ClientForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={newClient.name || ''}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="Nome completo do cliente"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={newClient.email || ''}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            placeholder="email@exemplo.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={newClient.cpf || ''}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setNewClient({ ...newClient, cpf: formatted });
            }}
            placeholder="000.000.000-00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnh">CNH *</Label>
          <Input
            id="cnh"
            value={newClient.cnh || ''}
            onChange={(e) => setNewClient({ ...newClient, cnh: e.target.value.replace(/\D/g, '') })}
            placeholder="12345678901"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={newClient.phone || ''}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setNewClient({ ...newClient, phone: formatted });
            }}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4>Endereço</h4>
        <div className="space-y-2">
          <Label htmlFor="street">Logradouro</Label>
          <Input
            id="street"
            value={newClient.address?.street || ''}
            onChange={(e) => setNewClient({ 
              ...newClient, 
              address: { ...newClient.address, street: e.target.value } 
            })}
            placeholder="Rua, número, complemento"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={newClient.address?.city || ''}
              onChange={(e) => setNewClient({ 
                ...newClient, 
                address: { ...newClient.address, city: e.target.value } 
              })}
              placeholder="Cidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={newClient.address?.state || ''}
              onChange={(e) => setNewClient({ 
                ...newClient, 
                address: { ...newClient.address, state: e.target.value } 
              })}
              placeholder="SP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={newClient.address?.zipCode || ''}
              onChange={(e) => setNewClient({ 
                ...newClient, 
                address: { ...newClient.address, zipCode: e.target.value } 
              })}
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1>Gestão de Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie o cadastro de clientes da locadora
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha as informações do cliente
                </DialogDescription>
              </DialogHeader>
              <ClientForm />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700">
                  Salvar Cliente
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
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-xl font-bold">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Inativos</p>
                  <p className="text-xl font-bold">{clients.filter(c => c.status === 'inactive').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Bloqueados</p>
                  <p className="text-xl font-bold">{clients.filter(c => c.status === 'blocked').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CPF, e-mail ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Locações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">CNH: {client.cnh}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{client.cpf}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.totalRentals}</div>
                          {client.lastRental && (
                            <div className="text-sm text-muted-foreground">
                              Última: {new Date(client.lastRental).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
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

        {/* View Client Dialog */}
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
            </DialogHeader>
            {selectedClient && (
              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <p>{selectedClient.name}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                    </div>
                    <div>
                      <Label>CPF</Label>
                      <p>{selectedClient.cpf}</p>
                    </div>
                    <div>
                      <Label>CNH</Label>
                      <p>{selectedClient.cnh}</p>
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <p>{selectedClient.phone}</p>
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <p>{selectedClient.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Endereço</Label>
                    <div className="flex items-center text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {selectedClient.address.street}, {selectedClient.address.city} - {selectedClient.address.state}, {selectedClient.address.zipCode}
                      </span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="space-y-4">
                    <h4>Histórico de Locações</h4>
                    {mockRentals[selectedClient.id] ? (
                      <div className="space-y-2">
                        {mockRentals[selectedClient.id].map((rental) => (
                          <Card key={rental.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{rental.vehicle}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(rental.startDate).toLocaleDateString('pt-BR')} - {new Date(rental.endDate).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">R$ {rental.totalAmount}</p>
                                  <Badge variant="secondary">{rental.status}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma locação encontrada</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize as informações do cliente
              </DialogDescription>
            </DialogHeader>
            <ClientForm />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingClient(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateClient} className="bg-blue-600 hover:bg-blue-700">
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
