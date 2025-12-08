import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Eye, KeyRound, Search } from 'lucide-react';
import { type ReactNode } from 'react';

type Rental = {
    id: number;
    client: string;
    vehicle: string;
    plate?: string;
    start_date: string;
    end_date: string;
    status: 'in_progress' | 'overdue' | 'finished' | string;
    amount?: number;
};

type RentalsPageProps = {
    rentals: {
        data: Rental[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters?: {
        status?: string;
        client?: string;
        vehicle?: string;
        date?: string;
    };
    stats?: {
        in_progress?: number;
        overdue?: number;
        finished_month?: number;
        revenue_estimated?: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Locações', href: '/rentals' }];

const statusLabel: Record<string, string> = {
    in_progress: 'Em andamento',
    overdue: 'Atrasada',
    finished: 'Finalizada',
};

const statusChip: Record<string, string> = {
    in_progress: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    overdue: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    finished: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
};

export default function RentalsPage({ rentals, filters, stats }: RentalsPageProps) {
    const { data, setData, get, processing } = useForm({
        status: filters?.status ?? 'all',
        client: filters?.client ?? '',
        vehicle: filters?.vehicle ?? '',
        date: filters?.date ?? '',
    });

    const summary = {
        inProgress: stats?.in_progress ?? 0,
        overdue: stats?.overdue ?? 0,
        finished: stats?.finished_month ?? 0,
        revenue: stats?.revenue_estimated ?? 0,
    };

    const applyFilters = () => {
        get('/rentals', {
            preserveScroll: true,
            replace: true,
            data,
        });
    };

    const clearFilters = () => {
        setData({ status: 'all', client: '', vehicle: '', date: '' });
        get('/rentals', {
            preserveScroll: true,
            replace: true,
            data: { status: '', client: '', vehicle: '', date: '' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Locações" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Locações</h1>
                            <p className="text-sm text-slate-600">
                                Gerencie todas as locações ativas, atrasadas e finalizadas.
                            </p>
                        </div>
                        <Link
                            href="/rentals/create"
                            className="inline-flex items-center rounded-md bg-[#1f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                        >
                            + Nova Locação
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Em andamento" value={summary.inProgress} />
                        <StatCard label="Atrasadas" value={summary.overdue} />
                        <StatCard label="Finalizadas (mês)" value={summary.finished} />
                        <StatCard
                            label="Receita estimada"
                            value={
                                summary.revenue
                                    ? Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                      }).format(summary.revenue)
                                    : 'R$ 0,00'
                            }
                        />
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="space-y-4 p-4">
                            <div className="grid gap-3 lg:grid-cols-4">
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger className="h-10 w-full">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="in_progress">Em andamento</SelectItem>
                                        <SelectItem value="overdue">Atrasada</SelectItem>
                                        <SelectItem value="finished">Finalizada</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Buscar por cliente"
                                        className="h-10 pl-10"
                                        value={data.client}
                                        onChange={(e) => setData('client', e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Buscar por modelo ou placa"
                                        className="h-10 pl-10"
                                        value={data.vehicle}
                                        onChange={(e) => setData('vehicle', e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="date"
                                        className="h-10 pl-10"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
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
                                    Limpar filtros
                                </Button>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Veículo</TableHead>
                                            <TableHead>Período</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rentals?.data?.map((rental) => (
                                            <TableRow key={rental.id} className="hover:bg-slate-50">
                                                <TableCell className="font-semibold text-slate-900">
                                                    {rental.client}
                                                </TableCell>
                                                <TableCell className="text-slate-700">
                                                    {rental.vehicle}
                                                    {rental.plate ? ` (${rental.plate})` : ''}
                                                </TableCell>
                                                <TableCell className="text-slate-700">
                                                    {rental.start_date} - {rental.end_date}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                            statusChip[rental.status] ??
                                                            'bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        {statusLabel[rental.status] ?? rental.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-slate-800">
                                                    {rental.amount
                                                        ? Intl.NumberFormat('pt-BR', {
                                                              style: 'currency',
                                                              currency: 'BRL',
                                                          }).format(rental.amount)
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-3 text-slate-600">
                                                        <button
                                                            type="button"
                                                            className="rounded-full p-1 hover:bg-slate-100"
                                                            aria-label="Registrar devolução"
                                                        >
                                                            <KeyRound className="h-4 w-4" />
                                                        </button>
                                                        <Link
                                                            href={`/rentals/${rental.id}`}
                                                            className="rounded-full p-1 hover:bg-slate-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {rentals?.data?.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-6 text-center text-slate-600">
                                                    Nenhuma locação encontrada.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-200 px-2 py-2 text-sm text-slate-600">
                                <div>
                                    Mostrando {rentals?.from ?? 0}-{rentals?.to ?? 0} de {rentals?.total ?? 0} resultados
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(rentals?.links, 'Anterior') ?? '#'}
                                    >
                                        &lt;
                                    </Link>
                                    <Link
                                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(rentals?.links, 'Próximo') ?? '#'}
                                    >
                                        &gt;
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

function StatCard({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function findLink(
    links: { url: string | null; label: string; active: boolean }[] | undefined,
    labelText: string,
): string | null {
    return links?.find((l) => l.label?.toLowerCase().includes(labelText.toLowerCase()))?.url ?? null;
}
