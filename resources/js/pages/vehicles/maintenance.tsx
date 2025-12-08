import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

type Maintenance = {
    id: number;
    vehicle: {
        model: string;
        plate: string;
        photo_url?: string | null;
    };
    type: 'preventive' | 'corrective' | string;
    scheduled_date?: string;
    provider?: string;
    cost?: number;
    status?: 'pending' | 'in_progress' | 'done' | 'overdue' | string;
};

type MaintenancePageProps = {
    maintenances: {
        data: Maintenance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters?: {
        search?: string;
        type?: string;
        status?: string;
        date?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Veículos', href: '/vehicles' },
    { title: 'Gestão de Manutenção', href: '/vehicles/maintenance' },
];

const typeLabel: Record<string, string> = {
    preventive: 'Preventiva',
    corrective: 'Corretiva',
};

const statusLabel: Record<string, string> = {
    pending: 'Agendada',
    in_progress: 'Em andamento',
    done: 'Concluída',
    overdue: 'Atrasada',
};

const statusChip: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    in_progress: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    done: 'bg-green-100 text-green-700 ring-1 ring-green-200',
    overdue: 'bg-red-100 text-red-700 ring-1 ring-red-200',
};

export default function MaintenancePage({ maintenances, filters }: MaintenancePageProps) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? '',
        type: filters?.type ?? 'all',
        status: filters?.status ?? 'all',
        date: filters?.date ?? 'this_month',
    });

    const applyFilters = () => {
        get('/vehicles/maintenance', {
            preserveScroll: true,
            replace: true,
            data,
        });
    };

    const clearFilters = () => {
        setData({ search: '', type: 'all', status: 'all', date: 'this_month' });
        get('/vehicles/maintenance', {
            preserveScroll: true,
            replace: true,
            data: { search: '', type: '', status: '', date: '' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestão de Manutenção" />
            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Gestão de Manutenção
                            </h1>
                            <p className="text-sm text-slate-600">
                                Gerencie manutenções preventivas e corretivas da frota.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="secondary"
                                className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                                Ver manutenções pendentes
                            </Button>
                            <Link
                                href="/vehicles/maintenance/create"
                                className="inline-flex items-center rounded-md bg-[#1f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            >
                                + Agendar Manutenção
                            </Link>
                        </div>
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Filtros
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative w-full lg:max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Buscar por placa ou modelo do veículo"
                                    className="h-10 pl-10"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>

                            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger className="h-10 w-full lg:w-40">
                                        <SelectValue placeholder="Tipo: Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tipo: Todos</SelectItem>
                                        <SelectItem value="preventive">Preventiva</SelectItem>
                                        <SelectItem value="corrective">Corretiva</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger className="h-10 w-full lg:w-40">
                                        <SelectValue placeholder="Status: Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Status: Todos</SelectItem>
                                        <SelectItem value="pending">Agendada</SelectItem>
                                        <SelectItem value="in_progress">Em andamento</SelectItem>
                                        <SelectItem value="done">Concluída</SelectItem>
                                        <SelectItem value="overdue">Atrasada</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={data.date}
                                    onValueChange={(value) => setData('date', value)}
                                >
                                    <SelectTrigger className="h-10 w-full lg:w-40">
                                        <SelectValue placeholder="Data: Este mês" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="this_month">Este mês</SelectItem>
                                        <SelectItem value="next_month">Próximo mês</SelectItem>
                                        <SelectItem value="all">Todas</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex gap-2 lg:ml-auto">
                                    <Button
                                        type="button"
                                        className="h-10 rounded-md bg-[#2f62de] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.25)] transition-colors hover:bg-[#244ec1]"
                                        onClick={applyFilters}
                                        disabled={processing}
                                    >
                                        Aplicar filtros
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                        onClick={clearFilters}
                                        disabled={processing}
                                    >
                                        Limpar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Veículo</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Data agendada</TableHead>
                                        <TableHead>Prestador de serviço</TableHead>
                                        <TableHead>Custo</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {maintenances?.data?.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            item.vehicle.photo_url ??
                                                            'https://via.placeholder.com/48x48?text=Car'
                                                        }
                                                        alt={item.vehicle.model}
                                                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900">
                                                            {item.vehicle.model}
                                                        </span>
                                                        <span className="text-sm text-slate-600">
                                                            {item.vehicle.plate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {typeLabel[item.type] ?? item.type}
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {item.scheduled_date ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {item.provider ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {item.cost
                                                    ? Intl.NumberFormat('pt-BR', {
                                                          style: 'currency',
                                                          currency: 'BRL',
                                                      }).format(item.cost)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusChip[item.status ?? 'pending'] ??
                                                        'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusLabel[item.status ?? 'pending'] ?? item.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-semibold text-[#2f62de]">
                                                <Link href={`/vehicles/maintenance/${item.id}/edit`}>Editar</Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {maintenances?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-6 text-center text-slate-600">
                                                Nenhuma manutenção encontrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                                <div>
                                    Mostrando {maintenances?.from ?? 0}-{maintenances?.to ?? 0} de{' '}
                                    {maintenances?.total ?? 0}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(maintenances?.links, 'Anterior') ?? '#'}
                                    >
                                        Anterior
                                    </Link>
                                    <Link
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(maintenances?.links, 'Próximo') ?? '#'}
                                    >
                                        Próximo
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function findLink(
    links: { url: string | null; label: string; active: boolean }[] | undefined,
    labelText: string,
): string | null {
    return links?.find((l) => l.label?.toLowerCase().includes(labelText.toLowerCase()))?.url ?? null;
}
