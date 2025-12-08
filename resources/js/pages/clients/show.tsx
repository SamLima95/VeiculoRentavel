import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CarFront, Clock, Phone, UserRound } from 'lucide-react';

type Client = {
    id: number;
    name: string;
    cpf?: string;
    phone?: string;
    email?: string;
    status?: 'active' | 'inactive' | 'pending' | string;
    rentals_count?: number;
    reservations_count?: number;
    fines_count?: number;
    notes?: string;
};

const statusLabel: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
};

const statusChip: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    inactive: 'bg-slate-200 text-slate-700 ring-1 ring-slate-300',
    pending: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
};

type ClientShowProps = {
    client: Client;
};

export default function ClientShow({ client }: ClientShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Clientes', href: '/clients' },
        { title: client.name, href: `/clients/${client.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cliente - ${client.name}`} />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Cliente</h1>
                        <p className="text-sm text-slate-600">Dados cadastrais e acoes rapidas.</p>
                        <Badge
                            className={`${statusChip[client.status ?? 'active'] ?? 'bg-slate-100 text-slate-700'} px-3 py-1 text-[13px] font-semibold`}
                        >
                            {statusLabel[client.status ?? 'active'] ?? client.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="secondary"
                            className="h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            asChild
                        >
                            <Link href="/clients">Voltar</Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            asChild
                        >
                            <Link href={`/clients/${client.id}/edit`}>Editar</Link>
                        </Button>
                        <Button
                            className="h-9 rounded-md bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            asChild
                        >
                            <Link href={`/reservations/create?client_id=${client.id}`}>Nova reserva</Link>
                        </Button>
                        <Button
                            className="h-9 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition-colors hover:bg-emerald-700"
                            asChild
                        >
                            <Link href={`/rentals/create?client_id=${client.id}`}>Nova locacao</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">Dados do cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <InfoRow icon={<UserRound className="h-4 w-4 text-blue-600" />} label="Nome" value={client.name} />
                            <InfoRow icon={<Clock className="h-4 w-4 text-amber-600" />} label="CPF" value={client.cpf ?? '-'} />
                            <InfoRow icon={<Phone className="h-4 w-4 text-emerald-600" />} label="Telefone" value={client.phone ?? '-'} />
                            <InfoRow icon={<Clock className="h-4 w-4 text-slate-600" />} label="Email" value={client.email ?? '-'} />
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">Resumo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <SummaryItem label="Locacoes" value={client.rentals_count ?? 0} icon={<CarFront className="h-4 w-4 text-blue-600" />} />
                            <SummaryItem label="Reservas" value={client.reservations_count ?? 0} icon={<CalendarClock className="h-4 w-4 text-emerald-600" />} />
                            <SummaryItem label="Multas" value={client.fines_count ?? 0} icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} />
                        </CardContent>
                    </Card>
                </div>

                {client.notes && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">Observacoes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-700">{client.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
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

function SummaryItem({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    {icon}
                </span>
                <span>{label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
    );
}
