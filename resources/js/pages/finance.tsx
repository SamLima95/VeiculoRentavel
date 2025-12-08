import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BadgeDollarSign,
    Download,
    FileSpreadsheet,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { type ComponentType, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Relatorios',
        href: '/finance',
    },
];

type Metric = {
    label: string;
    value: string;
    helper?: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    bg: string;
};

type RentalRow = {
    client: string;
    vehicle: string;
    period: string;
    amount: string;
    status: 'finalized' | 'in_progress' | 'canceled' | 'scheduled';
};

const metrics: Metric[] = [
    {
        label: 'Receita Total',
        value: 'R$ 150.000',
        icon: BadgeDollarSign,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Taxa de OcupacaoAśo',
        value: '85%',
        icon: TrendingUp,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        label: 'Total de LocaAAćes',
        value: '210',
        icon: LineChartIcon,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
    },
    {
        label: 'ManutenAAćes',
        value: '25',
        icon: PieChartIcon,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
];

const revenueSeries = [
    { day: '01', value: 4200 },
    { day: '04', value: 7800 },
    { day: '07', value: 5200 },
    { day: '10', value: 9800 },
    { day: '13', value: 8600 },
    { day: '16', value: 10400 },
    { day: '19', value: 6200 },
    { day: '22', value: 13600 },
    { day: '25', value: 9400 },
    { day: '28', value: 14800 },
    { day: '30', value: 13200 },
];

const fleetComposition = [
    { name: 'Locados', value: 70, color: '#1f56d8' },
    { name: 'Disponiveis', value: 15, color: '#10b981' },
    { name: 'ManutenAAśo', value: 15, color: '#f59e0b' },
];

const recentRentals: RentalRow[] = [
    {
        client: 'Ana Clara Souza',
        vehicle: 'Fiat Mobi',
        period: '15/05/24 - 20/05/24',
        amount: 'R$ 450,00',
        status: 'finalized',
    },
    {
        client: 'Bruno Martins',
        vehicle: 'Jeep Renegade',
        period: '18/05/24 - 25/05/24',
        amount: 'R$ 1.250,00',
        status: 'in_progress',
    },
    {
        client: 'Carlos Eduardo Pereira',
        vehicle: 'Hyundai HB20',
        period: '22/05/24 - 23/05/24',
        amount: 'R$ 180,00',
        status: 'canceled',
    },
    {
        client: 'Daniela Ferreira',
        vehicle: 'Toyota Corolla',
        period: '28/05/24 - 02/06/24',
        amount: 'R$ 980,00',
        status: 'scheduled',
    },
];

const statusStyle: Record<RentalRow['status'], string> = {
    finalized: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    canceled: 'bg-red-100 text-red-700',
    scheduled: 'bg-amber-100 text-amber-700',
};

const statusLabel: Record<RentalRow['status'], string> = {
    finalized: 'Finalizada',
    in_progress: 'Em andamento',
    canceled: 'Cancelada',
    scheduled: 'Agendada',
};

export default function Finance() {
    const [period, setPeriod] = useState('30d');
    const [category, setCategory] = useState('all');
    const [groupBy, setGroupBy] = useState('client');

    const fleetTotal = useMemo(
        () => fleetComposition.reduce((sum, item) => sum + item.value, 0),
        []
    );

    const occupancyRate = useMemo(() => {
        const rented = fleetComposition.find((item) => item.name === 'Locados')?.value ?? 0;
        return fleetTotal ? Math.round((rented / fleetTotal) * 100) : 0;
    }, [fleetTotal]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Relatorios Gerenciais" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Relatorios Gerenciais</h1>
                        <p className="text-sm text-slate-600">
                            Acompanhe o desempenho operacional da locadora.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <Link href="/settings/tariffs">Configurar tarifas</Link>
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <Link href="/finance/entries">Ver lancamentos</Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <Download className="h-4 w-4" />
                            Exportar PDF
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                        <span className="text-slate-500">PerA­odo:</span>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="h-8 w-[130px] border-none px-0 text-sm shadow-none focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">7 dias</SelectItem>
                                <SelectItem value="30d">30 dias</SelectItem>
                                <SelectItem value="90d">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                        <span className="text-slate-500">Categoria:</span>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-8 w-[160px] border-none px-0 text-sm shadow-none focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="compact">Compactos</SelectItem>
                                <SelectItem value="suv">SUV</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                        <span className="text-slate-500">VisAćo:</span>
                        <Select value={groupBy} onValueChange={setGroupBy}>
                            <SelectTrigger className="h-8 w-[130px] border-none px-0 text-sm shadow-none focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="client">Cliente</SelectItem>
                                <SelectItem value="category">Categoria</SelectItem>
                                <SelectItem value="channel">Canal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Card key={item.label} className="border-slate-200 shadow-sm">
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-slate-500">{item.label}</p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {item.value}
                                            </p>
                                            {item.helper && (
                                                <p className="text-xs text-slate-500">{item.helper}</p>
                                            )}
                                        </div>
                                        <span className={`rounded-full p-3 ${item.bg}`}>
                                            <Icon className={`h-5 w-5 ${item.color}`} />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Receita por PerA­odo
                            </CardTitle>
                            <p className="text-sm text-slate-500">Altimos 30 dias</p>
                        </CardHeader>
                        <CardContent className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueSeries}>
                                    <defs>
                                        <linearGradient id="revenueStroke" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1f56d8" stopOpacity={0.85} />
                                            <stop offset="100%" stopColor="#1f56d8" stopOpacity={0.15} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            borderColor: '#e2e8f0',
                                            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.12)',
                                        }}
                                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                                        labelFormatter={(label) => `Dia ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="url(#revenueStroke)"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                OcupaAAśo da Frota
                            </CardTitle>
                            <p className="text-sm text-slate-500">Total de veA-culos</p>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                    <Pie
                                        data={fleetComposition}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={95}
                                        strokeWidth={0}
                                    >
                                        {fleetComposition.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Locados</p>
                                        <p className="text-3xl font-semibold text-slate-900">{occupancyRate}%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                {fleetComposition.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="text-slate-500">
                                            {item.value}% ({Math.round(fleetTotal * (item.value / 100))} veA-culos)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-slate-900">
                            LocaAAćes Recentes
                        </CardTitle>
                        <p className="text-sm text-slate-500">
                            Detalhes das locaAAćes realizadas no perA­odo selecionado.
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Veiculo</TableHead>
                                    <TableHead>PerA­odo</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">AAAćes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentRentals.map((rental) => (
                                    <TableRow key={rental.client} className="hover:bg-slate-50/80">
                                        <TableCell className="font-semibold text-slate-900">
                                            {rental.client}
                                        </TableCell>
                                        <TableCell className="text-slate-700">{rental.vehicle}</TableCell>
                                        <TableCell className="text-slate-700">{rental.period}</TableCell>
                                        <TableCell className="text-slate-900">{rental.amount}</TableCell>
                                        <TableCell>
                                            <Badge className={`${statusStyle[rental.status]} px-3 py-1 text-[13px] font-medium`}>
                                                {statusLabel[rental.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href="#"
                                                className="text-sm font-semibold text-[#1f56d8] hover:underline"
                                            >
                                                Ver detalhes
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm text-slate-600">
                            <p>Exibindo 1-4 de 210 resultados</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-200 text-slate-700"
                                >
                                    Anterior
                                </Button>
                                <Button className="bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(33,101,214,0.3)] hover:bg-[#1c4cc5]">
                                    PrAłximo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
