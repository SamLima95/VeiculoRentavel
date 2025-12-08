import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CalendarClock,
    CarFront,
    ChevronDown,
    Clock,
    Info,
    Search,
    UserRound,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reservas', href: '/reservations' },
    { title: 'Nova', href: '/reservations/create' },
];

type VehicleOption = {
    id: number;
    title: string;
    plate: string;
    category: string;
    mileage: string;
    price: string;
    image?: string;
    status?: 'available' | 'unavailable';
};

type ClientOption = {
    id: number;
    name: string;
    cpf: string;
    phone: string;
    status?: 'ok' | 'pending';
};

type ReservationCreateProps = {
    vehicles?: VehicleOption[];
    clients?: ClientOption[];
};

export default function ReservationCreate({ vehicles = [], clients = [] }: ReservationCreateProps) {
    const { data, setData, post, processing } = useForm({
        start_at: '',
        end_at: '',
        vehicle_id: vehicles[0]?.id ?? null,
        client_id: clients[0]?.id ?? null,
    });

    const selectedVehicle = vehicles.find((v) => v.id === data.vehicle_id);
    const selectedClient = clients.find((c) => c.id === data.client_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reservations');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Reserva" />

            <form onSubmit={handleSubmit}>
                <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Nova Reserva</h1>
                            <p className="text-sm text-slate-600">
                                Crie uma intenção de locação preenchendo os dados abaixo.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/reservations"
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </Link>
                            <Button
                                type="submit"
                                className="bg-[#1f56d8] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                disabled={processing}
                            >
                                Salvar Reserva
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {/* 1. Seleção de período */}
                        <Section title="1. Selecione o Período" icon={<CalendarClock className="h-4 w-4" />}>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Data e Hora de Retirada">
                                    <Input
                                        type="datetime-local"
                                        value={data.start_at}
                                        onChange={(e) => setData('start_at', e.target.value)}
                                    />
                                </Field>
                                <Field label="Data e Hora de Devolução">
                                    <Input
                                        type="datetime-local"
                                        value={data.end_at}
                                        onChange={(e) => setData('end_at', e.target.value)}
                                        className="aria-invalid:border-red-300"
                                        aria-invalid={
                                            !!data.start_at &&
                                            !!data.end_at &&
                                            new Date(data.end_at) <= new Date(data.start_at)
                                        }
                                    />
                                </Field>
                            </div>
                            {data.start_at &&
                                data.end_at &&
                                new Date(data.end_at) <= new Date(data.start_at) && (
                                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                        <Info className="h-4 w-4" />
                                        Período inválido. A data de devolução não pode ser anterior à data de retirada.
                                    </div>
                                )}
                        </Section>

                        {/* 2. Veículos Disponíveis */}
                        <Section
                            title="2. Veículos Disponíveis"
                            icon={<CarFront className="h-4 w-4" />}
                            description="Selecione um veículo disponível."
                        >
                            <div className="flex flex-col gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Buscar por placa ou modelo..."
                                        className="h-10 pl-10"
                                        // TODO: hook up search filter
                                    />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {vehicles.map((vehicle) => (
                                        <button
                                            type="button"
                                            key={vehicle.id}
                                            onClick={() => setData('vehicle_id', vehicle.id)}
                                            className={`flex flex-col gap-3 rounded-xl border p-3 text-left shadow-sm transition-[border,box-shadow] hover:shadow-md ${
                                                data.vehicle_id === vehicle.id
                                                    ? 'border-[#2f62de] ring-2 ring-[#2f62de]/20'
                                                    : 'border-slate-200'
                                            }`}
                                        >
                                            <img
                                                src={
                                                    vehicle.image ??
                                                    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=700'
                                                }
                                                alt={vehicle.title}
                                                className="h-36 w-full rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {vehicle.title}
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                    {vehicle.plate} • {vehicle.category}
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                    Km: {vehicle.mileage} | Diária: {vehicle.price}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <Badge
                                                    className={`rounded-full ${
                                                        vehicle.status === 'available'
                                                            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                                            : 'bg-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    {vehicle.status === 'available'
                                                        ? 'Disponível'
                                                        : 'Indisponível'}
                                                </Badge>
                                                {data.vehicle_id === vehicle.id && (
                                                    <span className="text-[#2f62de]">Selecionado</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* 3. Seleção de Cliente */}
                        <Section
                            title="3. Selecione o Cliente"
                            icon={<UserRound className="h-4 w-4" />}
                            description="Busque o cliente pelo nome ou CPF."
                        >
                            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Buscar cliente por nome ou CPF"
                                            className="h-10 pl-10"
                                            // TODO: hook up search filter
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                    >
                                        + Cadastrar novo cliente
                                    </Button>
                                </div>

                                {selectedClient && (
                                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f56d8]/10 text-[#1f56d8]">
                                                <UserRound className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {selectedClient.name}
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                    CPF: {selectedClient.cpf} • {selectedClient.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                                            Checagem OK
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </Section>

                        {/* 4. Estimativa de valor */}
                        <Section
                            title="4. Estimativa de Valor da Locação"
                            icon={<Info className="h-4 w-4" />}
                            description="Resumo do custo estimado (tarifas de exemplo)."
                        >
                            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                                <div className="grid gap-3 text-sm text-slate-800">
                                    <LineItem label="Início" value="15/08/2024, 10:00" />
                                    <LineItem label="Fim" value="20/08/2024, 10:00" />
                                    <LineItem label="Diárias (5 x R$ 150,00)" value="R$ 750,00" />
                                    <LineItem label="Taxa de Serviço (10%)" value="R$ 75,00" />
                                    <LineItem label="Seguro Básico" value="R$ 50,00" />
                                    <LineItem
                                        label="Desconto Promocional"
                                        value="- R$ 25,00"
                                        valueClass="text-emerald-600"
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-700">Valor Total Estimado</p>
                                    <p className="text-xl font-bold text-[#1f56d8]">R$ 850,00</p>
                                </div>
                                <p className="text-xs text-slate-500">
                                    *Estimação baseada nas tarifas configuradas (RF011).
                                </p>
                            </div>
                        </Section>
                    </div>

                    <div className="mt-5 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                        <Link
                            href="/reservations"
                            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            Cancelar
                        </Link>
                        <Button
                            type="submit"
                            className="bg-[#1f56d8] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            disabled={processing}
                        >
                            Salvar Reserva
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

function Section({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    {icon && <div className="text-slate-500">{icon}</div>}
                    <CardTitle className="text-base font-semibold text-slate-900">
                        {title}
                    </CardTitle>
                </div>
                {description && <p className="text-sm text-slate-600">{description}</p>}
            </CardHeader>
            <CardContent className="space-y-3">{children}</CardContent>
        </Card>
    );
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
    return (
        <div className="space-y-1">
            <Label className="text-sm font-semibold text-slate-800">{label}</Label>
            {children}
        </div>
    );
}

function LineItem({
    label,
    value,
    valueClass,
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">{label}</span>
            <span className={`text-sm font-semibold ${valueClass ?? 'text-slate-900'}`}>{value}</span>
        </div>
    );
}
