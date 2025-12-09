import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';

type Reservation = {
    id: number;
    client?: { name?: string; document?: string };
    vehicle?: { brand?: string; model?: string; plate?: string };
    start_date: string;
    end_date: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | string;
    status_label?: string;
    estimated_value?: number | string | null;
};

type ReservationsPageProps = {
    reservations: {
        data: Reservation[];
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
        status?: string;
    };
    stats?: {
        confirmed_month?: number;
        pending?: number;
        canceled?: number;
        occupancy_rate?: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reservas', href: '/reservations' }];

const statusLabel: Record<string, string> = {
    confirmed: 'Confirmada',
    pending: 'Pendente',
    cancelled: 'Cancelada',
    completed: 'Concluida',
};

const statusChip: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    pending: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    completed: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
};

export default function ReservationsPage({ reservations, filters, stats }: ReservationsPageProps) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? '',
        status: filters?.status ?? 'all',
    });
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const summary = {
        confirmed: stats?.confirmed_month ?? 0,
        pending: stats?.pending ?? 0,
        cancelled: stats?.canceled ?? 0,
        occupancy: stats?.occupancy_rate ?? 0,
    };

    const calendarEvents = useMemo(() => {
        return (reservations?.data ?? []).map((reservation) => ({
            id: reservation.id,
            title: `${reservation.client_name} - ${reservation.vehicle}`,
            period: `${reservation.start_date} - ${reservation.end_date}`,
            status: reservation.status,
        }));
    }, [reservations?.data]);

    const applyFilters = () => {
        get('/reservations', {
            preserveScroll: true,
            replace: true,
            data,
        });
    };

    const clearFilters = () => {
        setData({ search: '', status: 'all' });
        get('/reservations', {
            preserveScroll: true,
            replace: true,
            data: { search: '', status: '' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservas" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Reservas</h1>
                            <p className="text-sm text-slate-600">
                                Visualize e gerencie as reservas futuras da frota.
                            </p>
                        </div>
                        <Link
                            href="/reservations/create"
                            className="inline-flex items-center rounded-md bg-[#1f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                        >
                            + Nova Reserva
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Reservas Confirmadas (mes)" value={summary.confirmed} />
                        <StatCard label="Reservas Pendentes" value={summary.pending} />
                        <StatCard label="Cancelamentos" value={summary.canceled} />
                        <StatCard label="Taxa de Ocupacao" value={`${summary.occupancy}%`} />
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardContent className="space-y-4 p-4">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'outline'}
                                    className={`h-9 rounded-md px-4 text-sm font-semibold ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    Visualizacao em Lista
                                </Button>
                                <Button
                                    variant={viewMode === 'calendar' ? 'secondary' : 'outline'}
                                    className={`h-9 rounded-md px-4 text-sm font-semibold ${viewMode === 'calendar' ? 'bg-slate-100 text-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                    onClick={() => setViewMode('calendar')}
                                >
                                    Visualizacao em Calendario
                                </Button>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                    <div className="relative w-full lg:max-w-md">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Buscar por cliente, veiculo ou placa"
                                            className="h-10 pl-10"
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) => setData('status', value)}
                                        >
                                            <SelectTrigger className="h-10 w-full lg:w-44">
                                                <SelectValue placeholder="Status: Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Status: Todos</SelectItem>
                                                <SelectItem value="confirmed">Confirmada</SelectItem>
                                                <SelectItem value="pending">Pendente</SelectItem>
                                                <SelectItem value="canceled">Cancelada</SelectItem>
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
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <>
                                    <div className="rounded-lg border border-slate-200 bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50">
                                                    <TableHead>Cliente</TableHead>
                                                    <TableHead>Veiculo</TableHead>
                                                    <TableHead>Periodo</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Acoes</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(reservations?.data ?? []).map((reservation) => (
                                                    <TableRow key={reservation.id} className="hover:bg-slate-50">
                                                        <TableCell className="font-semibold text-slate-900">
                                                            {reservation.client?.name ?? '—'}
                                                        </TableCell>
                                                        <TableCell className="text-slate-700">
                                                            {(reservation.vehicle?.brand ?? '') + ' ' + (reservation.vehicle?.model ?? '')}
                                                            {reservation.vehicle?.plate ? ` (${reservation.vehicle?.plate})` : ''}
                                                        </TableCell>
                                                        <TableCell className="text-slate-700">
                                                            {reservation.start_date} - {reservation.end_date}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    statusChip[reservation.status] ??
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}
                                                            >
                                                                {reservation.status_label ?? reservation.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right text-sm font-semibold text-[#2f62de]">
                                                            <Link href={`/reservations/${reservation.id}`}>Ver detalhes</Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {(reservations?.data ?? []).length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="py-6 text-center text-slate-600">
                                                            Nenhuma reserva encontrada.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-200 px-2 py-2 text-sm text-slate-600">
                                        <div>
                                            Mostrando {reservations?.from ?? 0}-{reservations?.to ?? 0} de {reservations?.total ?? 0} reservas
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                                href={findLink(reservations?.links, 'Anterior') ?? '#'}
                                            >
                                                Anterior
                                            </Link>
                                            <Link
                                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                                href={findLink(reservations?.links, 'Proximo') ?? '#'}
                                            >
                                                Proximo
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                        {calendarEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="rounded-lg border border-slate-100 bg-slate-50 p-3 shadow-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {event.title}
                                                    </p>
                                                    <Badge
                                                        className={`${statusChip[event.status] ?? 'bg-slate-100 text-slate-700'} px-2 py-1 text-[12px] font-medium`}
                                                    >
                                                        {statusLabel[event.status] ?? event.status}
                                                    </Badge>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-600">{event.period}</p>
                                                <div className="mt-3 flex justify-end">
                                                    <Link
                                                        href={`/reservations/${event.id}`}
                                                        className="text-sm font-semibold text-[#1f56d8] hover:underline"
                                                    >
                                                        Ver detalhes
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        {calendarEvents.length === 0 && (
                                            <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                                                Nenhum evento no periodo selecionado.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
