import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CalendarClock, CarFront, CheckCircle2, Clock, Gauge, MapPin, UserRound } from 'lucide-react';

type Rental = {
    id: number;
    client: string;
    vehicle: string;
    plate?: string;
    start_date: string;
    end_date: string;
    status: 'in_progress' | 'overdue' | 'finished' | string;
    amount?: string;
    mileage_start?: string;
    mileage_end?: string;
    notes?: string;
};

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

type RentalShowProps = {
    rental: Rental;
};

export default function RentalShow({ rental }: RentalShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Locacoes', href: '/rentals' },
        { title: `Locacao #${rental.id}`, href: `/rentals/${rental.id}` },
    ];

    const { processing, post } = useForm({});

    const go = (action: 'check-in' | 'check-out') => {
        window.location.href = `/rentals/${action}?rental_id=${rental.id}`;
    };

    const finish = () => {
        if (!window.confirm('Encerrar esta locacao?')) return;
        post(`/rentals/${rental.id}/finish`, { preserveScroll: true, preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Locacao #${rental.id}`} />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Locacao #{rental.id}</h1>
                        <p className="text-sm text-slate-600">Acompanhe o contrato em andamento.</p>
                        <Badge className={`${statusChip[rental.status] ?? 'bg-slate-100 text-slate-700'} px-3 py-1 text-[13px] font-semibold`}>
                            {statusLabel[rental.status] ?? rental.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="h-9 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => go('check-in')}
                        >
                            Check-in
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => go('check-out')}
                        >
                            Check-out
                        </Button>
                        <Button
                            className="h-9 rounded-md bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            onClick={finish}
                            disabled={processing}
                        >
                            Encerrar
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
                                <InfoRow
                                    icon={<UserRound className="h-4 w-4 text-blue-600" />}
                                    label="Cliente"
                                    value={rental.client}
                                />
                                <InfoRow
                                    icon={<CarFront className="h-4 w-4 text-emerald-600" />}
                                    label="Veiculo"
                                    value={`${rental.vehicle}${rental.plate ? ` (${rental.plate})` : ''}`}
                                />
                                <InfoRow
                                    icon={<CalendarClock className="h-4 w-4 text-indigo-600" />}
                                    label="Periodo"
                                    value={`${rental.start_date} - ${rental.end_date}`}
                                />
                                <InfoRow
                                    icon={<Gauge className="h-4 w-4 text-amber-600" />}
                                    label="Quilometragem"
                                    value={
                                        rental.mileage_start
                                            ? `${rental.mileage_start ?? '-'} km -> ${rental.mileage_end ?? '-'} km`
                                            : '-'
                                    }
                                />
                                <InfoRow
                                    icon={<Clock className="h-4 w-4 text-slate-600" />}
                                    label="Status"
                                    value={statusLabel[rental.status] ?? rental.status}
                                />
                                <InfoRow
                                    icon={<MapPin className="h-4 w-4 text-slate-600" />}
                                    label="Valor"
                                    value={rental.amount ?? '-'}
                                />
                            </div>

                            {rental.notes && (
                                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
                                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                                    <div>
                                        <p className="font-semibold">Observacoes</p>
                                        <p>{rental.notes}</p>
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
                            <Step label="Realizar check-in (retirada) com vistoria e fotos." />
                            <Step label="Acompanhar andamento e registrar ocorrencias." />
                            <Step label="Realizar check-out (devolucao) e encerrar cobranca." />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900">{value ?? '-'}</p>
            </div>
        </div>
    );
}

function Step({ label }: { label: string }) {
    return (
        <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <p>{label}</p>
        </div>
    );
}
