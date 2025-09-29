import React from 'react';
import { Car, Users, Calendar, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const kpiData = [
  {
    title: 'Veículos Disponíveis',
    value: '42',
    total: '65',
    icon: Car,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    trend: '+5%',
    trendUp: true
  },
  {
    title: 'Reservas Ativas',
    value: '18',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    trend: '+12%',
    trendUp: true
  },
  {
    title: 'Locações em Andamento',
    value: '23',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    trend: '-3%',
    trendUp: false
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 85.240',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    trend: '+18%',
    trendUp: true
  }
];

const revenueData = [
  { month: 'Jan', revenue: 45000, rentals: 28 },
  { month: 'Fev', revenue: 52000, rentals: 32 },
  { month: 'Mar', revenue: 48000, rentals: 30 },
  { month: 'Abr', revenue: 61000, rentals: 38 },
  { month: 'Mai', revenue: 75000, rentals: 42 },
  { month: 'Jun', revenue: 85240, rentals: 48 }
];

const fleetUtilization = [
  { category: 'Econômico', total: 25, inUse: 18, available: 7 },
  { category: 'Intermediário', total: 20, inUse: 12, available: 8 },
  { category: 'Executivo', total: 15, inUse: 8, available: 7 },
  { category: 'SUV', total: 5, inUse: 3, available: 2 }
];

const categoryData = [
  { name: 'Em uso', value: 41, color: '#3b82f6' },
  { name: 'Disponível', value: 24, color: '#10b981' },
  { name: 'Manutenção', value: 5, color: '#f59e0b' }
];

const alerts = [
  { id: 1, type: 'warning', message: 'Honda Civic (ABC-1234) precisa de revisão em 2 dias', time: '2h ago' },
  { id: 2, type: 'info', message: 'Nova reserva confirmada para amanhã - Toyota Corolla', time: '4h ago' },
  { id: 3, type: 'danger', message: 'Volkswagen Gol (XYZ-9876) em manutenção há 5 dias', time: '1d ago' },
  { id: 4, type: 'success', message: 'Meta de receita mensal atingida!', time: '2d ago' }
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Page header */}
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-muted-foreground">
                        Visão geral das operações da locadora
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiData.map((kpi, index) => {
                        const Icon = kpi.icon;
                        return (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{kpi.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-2xl font-bold">{kpi.value}</h3>
                                                {kpi.total && (
                                                    <span className="text-sm text-muted-foreground">/{kpi.total}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-1 mt-1">
                                                {kpi.trendUp ? (
                                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                                )}
                                                <span className={`text-xs ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                                    {kpi.trend}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                                            <Icon className={`h-6 w-6 ${kpi.color}`} />
                                        </div>
                                    </div>
                                    {kpi.total && (
                                        <div className="mt-4">
                                            <Progress 
                                                value={(parseInt(kpi.value) / parseInt(kpi.total)) * 100} 
                                                className="h-2"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Receita e Locações</CardTitle>
                            <CardDescription>Últimos 6 meses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip formatter={(value, name) => [
                                        name === 'revenue' ? `R$ ${value.toLocaleString()}` : value,
                                        name === 'revenue' ? 'Receita' : 'Locações'
                                    ]} />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="revenue" />
                                    <Bar yAxisId="right" dataKey="rentals" fill="#10b981" name="rentals" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Fleet Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status da Frota</CardTitle>
                            <CardDescription>Distribuição atual dos veículos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} veículos`]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fleet Utilization */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Utilização por Categoria</CardTitle>
                            <CardDescription>Status atual por tipo de veículo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {fleetUtilization.map((category, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{category.category}</span>
                                            <span>{category.inUse}/{category.total}</span>
                                        </div>
                                        <Progress 
                                            value={(category.inUse / category.total) * 100} 
                                            className="h-2"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{category.inUse} em uso</span>
                                            <span>{category.available} disponíveis</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alertas e Notificações</CardTitle>
                            <CardDescription>Atividades recentes que requerem atenção</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {alert.type === 'warning' && (
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            )}
                                            {alert.type === 'info' && (
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            )}
                                            {alert.type === 'danger' && (
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                            )}
                                            {alert.type === 'success' && (
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{alert.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                        </div>
                                        <Badge 
                                            variant={
                                                alert.type === 'warning' ? 'secondary' :
                                                alert.type === 'info' ? 'default' :
                                                alert.type === 'danger' ? 'destructive' : 'secondary'
                                            }
                                        >
                                            {alert.type === 'warning' && 'Atenção'}
                                            {alert.type === 'info' && 'Info'}
                                            {alert.type === 'danger' && 'Urgente'}
                                            {alert.type === 'success' && 'Sucesso'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
