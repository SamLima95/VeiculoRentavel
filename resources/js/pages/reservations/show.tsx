import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CalendarClock, CarFront, CheckCircle2, Clock, MapPin, UserRound } from 'lucide-react';

type Reservation = {
    id: number;
    client?: {
        id: number;
        name?: string;
        document?: string;
    };
    vehicle?: {
        id: number;
        model?: string;
        brand?: string;
        plate?: string;
    };
    start_date: string;
    end_date: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | string;
    status_label?: string;
    estimated_value?: number | string | null;
    notes?: string;
    source_label?: string;
};

const statusChip: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    pending: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    cancelled: 'bg-red-100 text-red-700 ring-1 ring-red-200',
    completed: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
};

type ReservationShowProps = {
    reservation: Reservation;
};

export default function ReservationShow({ reservation }: ReservationShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservas', href: '/reservations' },
        { title: `Reserva #${reservation.id}`, href: `/reservations/${reservation.id}` },
    ];

    const { post, processing } = useForm({});

    const actOnReservation = (action: 'confirm' | 'cancel') => {
        const message =
            action === 'confirm'
                ? 'Confirmar esta reserva? Isso bloqueia o veiculo no periodo selecionado.'
                : 'Cancelar esta reserva? O veiculo sera liberado no periodo.';
        if (!window.confirm(message)) return;
        post(`/reservations/${reservation.id}/${action}`, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reserva #${reservation.id}`} />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Reserva #{reservation.id}</h1>
                        <p className="text-sm text-slate-600">Acompanhe status e dados desta reserva.</p>
                        <Badge className={`${statusChip[reservation.status] ?? 'bg-slate-100 text-slate-700'} px-3 py-1 text-[13px] font-semibold`}>
                            {reservation.status_label ?? reservation.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="secondary"
                            className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                            <Link href="/reservations">Voltar</Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => actOnReservation('cancel')}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="h-9 rounded-md bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            onClick={() => actOnReservation('confirm')}
                            disabled={processing}
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">Resumo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoItem
                                    icon={<UserRound className="h-4 w-4 text-blue-600" />}
                                    label="Cliente"
                                    value={reservation.client?.name ?? '—'}
                                    helper={reservation.client?.document}
                                />
                                <InfoItem
                                    icon={<CarFront className="h-4 w-4 text-emerald-600" />}
                                    label="Veiculo"
                                    value={`${reservation.vehicle?.brand ?? ''} ${reservation.vehicle?.model ?? ''}${
                                        reservation.vehicle?.plate ? ` (${reservation.vehicle?.plate})` : ''
                                    }`}
                                />
                                <InfoItem
                                    icon={<CalendarClock className="h-4 w-4 text-indigo-600" />}
                                    label="Periodo"
                                    value={`${reservation.start_date} - ${reservation.end_date}`}
                                />
                                <InfoItem
                                    icon={<Clock className="h-4 w-4 text-amber-600" />}
                                    label="Status"
                                    value={reservation.status_label ?? reservation.status}
                                />
                                <InfoItem
                                    icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                    label="Valor estimado"
                                    value={
                                        reservation.estimated_value
                                            ? new Intl.NumberFormat('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL',
                                              }).format(Number(reservation.estimated_value))
                                            : '—'
                                    }
                                />
                                <InfoItem
                                    icon={<MapPin className="h-4 w-4 text-slate-600" />}
                                    label="Origem"
                                    value={reservation.source_label ?? '—'}
                                />
                            </div>

                            {reservation.notes && (
                                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 mt-1" />
                                    <div>
                                        <p className="font-semibold">Observacoes</p>
                                        <p>{reservation.notes}</p>
                                    </div>
                                </div>
                            )}

                            {reservation.notes && (
                                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 mt-1" />
                                    <div>
                                        <p className="font-semibold">Observacoes</p>
                                        <p>{reservation.notes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Proximos passos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-700">
                            <Step label="Confirmar reserva para bloquear o veiculo." done={reservation.status === 'confirmed'} />
                            <Step label="Converter em locacao no balcão (check-in)." done={false} />
                            <Step label="Caso não utilizada, cancelar para liberar o veiculo." done={reservation.status === 'cancelled'} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoItem({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
    helper?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900">{value ?? '-'}</p>
                {helper && <p className="text-xs text-slate-600">{helper}</p>}
            </div>
        </div>
    );
}

function Step({ label, done }: { label: string; done?: boolean }) {
    return (
        <div className="flex items-start gap-2">
            <div
                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                    done ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
            >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            </div>
            <p className="text-sm text-slate-700">{label}</p>
        </div>
    );
}
