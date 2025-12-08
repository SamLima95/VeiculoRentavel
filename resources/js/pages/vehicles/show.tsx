import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    BadgeCheck,
    CalendarClock,
    CalendarDays,
    CarFront,
    CheckCircle2,
    CreditCard,
    Gauge,
    MapPin,
    Navigation,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type ReactNode, useMemo } from 'react';

type RelatedItem = {
    id: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    startDate?: string;
    endDate?: string;
    created_at?: string;
    updated_at?: string;
    description?: string;
    notes?: string;
    type?: string;
    amount?: string;
};

type Vehicle = {
    id: number;
    model?: string;
    brand?: string;
    year?: number;
    color?: string;
    plate?: string;
    mileage?: number;
    category?: string;
    status?: string;
    insurance_data?: Record<string, unknown> | null;
    daily_rate?: string | number | null;
    notes?: string | null;
    reservations?: RelatedItem[];
    rentals?: RelatedItem[];
    maintenances?: RelatedItem[];
    fines?: RelatedItem[];
    photo_url?: string | null;
    stats?: {
        total_rentals?: number;
        rentals_this_year?: number;
        maintenances?: number;
        fines?: number;
    };
};

type VehicleShowProps = {
    vehicle: Vehicle;
};

type TimelineItem = {
    id: string;
    title: string;
    date?: string;
    description?: string;
    kind: 'reservation' | 'rental' | 'maintenance' | 'fine';
    amount?: string;
};

const statusLabel: Record<string, string> = {
    available: 'Disponível',
    rented: 'Locado',
    maintenance: 'Em Manutenção',
};

const statusColor: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    rented: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-amber-100 text-amber-700',
};

const formatDate = (value?: string) => {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed);
};

export default function VehicleShow({ vehicle }: VehicleShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Veículos', href: '/vehicles' },
        { title: `${vehicle.brand ?? ''} ${vehicle.model ?? ''}`.trim(), href: `/vehicles/${vehicle.id}` },
    ];

    const timelineItems = useMemo<TimelineItem[]>(() => {
        const normalizeDate = (item: RelatedItem) =>
            item.start_date || item.startDate || item.created_at || item.updated_at || '';

        const rentals =
            vehicle.rentals?.map((r) => ({
                id: `rental-${r.id}`,
                title: 'Locação Concluída',
                date: normalizeDate(r),
                description: r.description || r.notes || `Status: ${r.status ?? '—'}`,
                kind: 'rental' as const,
                amount: r.amount,
            })) ?? [];

        const reservations =
            vehicle.reservations?.map((r) => ({
                id: `reservation-${r.id}`,
                title: 'Reserva Criada',
                date: normalizeDate(r),
                description: r.description || r.notes || `Status: ${r.status ?? '—'}`,
                kind: 'reservation' as const,
            })) ?? [];

        const maintenances =
            vehicle.maintenances?.map((m) => ({
                id: `maintenance-${m.id}`,
                title: 'Manutenção Preventiva',
                date: normalizeDate(m),
                description: m.description || m.notes || `Status: ${m.status ?? '—'}`,
                kind: 'maintenance' as const,
                amount: m.amount,
            })) ?? [];

        const fines =
            vehicle.fines?.map((f) => ({
                id: `fine-${f.id}`,
                title: 'Multa Registrada',
                date: normalizeDate(f),
                description: f.description || f.notes || `Status: ${f.status ?? '—'}`,
                kind: 'fine' as const,
                amount: f.amount,
            })) ?? [];

        return [...rentals, ...reservations, ...maintenances, ...fines].sort((a, b) => {
            const aTime = new Date(a.date ?? '').getTime();
            const bTime = new Date(b.date ?? '').getTime();
            return (bTime || 0) - (aTime || 0);
        });
    }, [vehicle.fines, vehicle.maintenances, vehicle.rentals, vehicle.reservations]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Veículo - ${vehicle.brand ?? ''} ${vehicle.model ?? ''}`} />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">Detalhes do Veículo</h1>
                                <p className="text-sm text-slate-600">
                                    {vehicle.brand} {vehicle.model} • Placa {vehicle.plate ?? '—'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                >
                                    <Link href={`/vehicles/${vehicle.id}/edit`}>Editar veículo</Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                >
                                    Criar reserva
                                </Button>
                                <Button className="h-9 rounded-md bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]">
                                    Registrar manutenção
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-[280px,1fr]">
                            <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
                                <img
                                    src={
                                        vehicle.photo_url ??
                                        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900'
                                    }
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="h-40 w-full rounded-lg object-cover"
                                />
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                        statusColor[vehicle.status ?? 'available'] ??
                                        'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {statusLabel[vehicle.status ?? 'available'] ?? vehicle.status ?? 'Disponível'}
                                </span>
                            </div>

                            <div className="grid gap-3 lg:grid-cols-2">
                                <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {vehicle.brand} {vehicle.model}
                                    </h3>
                                    <p className="text-sm text-slate-600">{vehicle.color ?? '—'}</p>
                                    <div className="mt-3 grid gap-2 text-sm text-slate-800">
                                        <InfoRow
                                            icon={<CalendarDays className="h-4 w-4 text-blue-600" />}
                                            label="Ano/Modelo"
                                            value={`${vehicle.year ?? '—'} • ${vehicle.color ?? '—'}`}
                                        />
                                        <InfoRow
                                            icon={<Navigation className="h-4 w-4 text-emerald-600" />}
                                            label="Categoria"
                                            value={vehicle.category ?? '—'}
                                        />
                                        <InfoRow
                                            icon={<ShieldCheck className="h-4 w-4 text-amber-600" />}
                                            label="Seguro"
                                            value={vehicle.insurance_data ? 'Apólice registrada' : '—'}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                    <div className="grid gap-2 text-sm text-slate-800">
                                        <InfoRow
                                            icon={<Gauge className="h-4 w-4 text-blue-600" />}
                                            label="Quilometragem"
                                            value={
                                                vehicle.mileage
                                                    ? new Intl.NumberFormat('pt-BR').format(vehicle.mileage) + ' km'
                                                    : '—'
                                            }
                                        />
                                        <InfoRow
                                            icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
                                            label="Documentação"
                                            value="Válida até 12/2024"
                                        />
                                        <InfoRow
                                            icon={<MapPin className="h-4 w-4 text-amber-600" />}
                                            label="Placa"
                                            value={vehicle.plate ?? '—'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total de locações" value={vehicle.stats?.total_rentals ?? 0} />
                        <StatCard label="Dias locados no ano" value={vehicle.stats?.rentals_this_year ?? 0} />
                        <StatCard label="Manutenções" value={vehicle.stats?.maintenances ?? 0} />
                        <StatCard label="Multas registradas" value={vehicle.stats?.fines ?? 0} />
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold text-slate-900">
                                    Timeline do Veículo
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    Histórico recente de reservas, locações, manutenções e multas.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
                                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50">
                                    Reservas
                                </Badge>
                                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50">
                                    Locações
                                </Badge>
                                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50">
                                    Manutenções
                                </Badge>
                                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50">
                                    Multas
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {timelineItems.length === 0 && (
                                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                                    Nenhum evento registrado ainda.
                                </div>
                            )}

                            <div className="space-y-4">
                                {timelineItems.map((item, index) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <TimelineIcon kind={item.kind} />
                                            {index < timelineItems.length - 1 && (
                                                <div className="h-full w-px flex-1 bg-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {item.title}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full border-slate-200 bg-slate-50 text-[11px] text-slate-700"
                                                >
                                                    {formatDate(item.date)}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-700">
                                                {item.description || 'Sem descrição.'}
                                            </p>
                                            {item.amount && (
                                                <p className="text-sm font-semibold text-emerald-600">
                                                    Valor: {item.amount}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center">
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <Link href="/vehicles">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para listagem de veículos
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value }: { label: string; value?: ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value ?? 0}</p>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value?: ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-sm text-slate-800">{value ?? '—'}</p>
            </div>
        </div>
    );
}

function TimelineIcon({ kind }: { kind: TimelineItem['kind'] }) {
    const base = 'h-9 w-9 rounded-full flex items-center justify-center shadow-xs';
    if (kind === 'reservation') {
        return (
            <div className={`${base} bg-blue-50 text-blue-700 border border-blue-100`}>
                <CalendarClock className="h-4 w-4" />
            </div>
        );
    }
    if (kind === 'rental') {
        return (
            <div className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100`}>
                <CheckCircle2 className="h-4 w-4" />
            </div>
        );
    }
    if (kind === 'fine') {
        return (
            <div className={`${base} bg-orange-50 text-orange-700 border border-orange-100`}>
                <AlertTriangle className="h-4 w-4" />
            </div>
        );
    }
    return (
        <div className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}>
            <Wrench className="h-4 w-4" />
        </div>
    );
}
