import InputError from '@/components/input-error';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeInfo, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

type Vehicle = {
    id: number;
    photo_url?: string | null;
    model: string;
    brand: string;
    plate: string;
    category?: string;
    status: 'available' | 'rented' | 'maintenance' | string;
};

type VehiclesPageProps = {
    vehicles: {
        data: Vehicle[];
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
        category?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Veículos', href: '/vehicles' }];

const statusLabel: Record<string, string> = {
    available: 'Disponível',
    rented: 'Locado',
    maintenance: 'Em Manutenção',
};

const statusColor: Record<string, string> = {
    available: 'bg-green-100 text-green-700 ring-1 ring-green-200',
    rented: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    maintenance: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
};

export default function VehiclesIndex({ vehicles, filters }: VehiclesPageProps) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? '',
        status: filters?.status ?? 'all',
        category: filters?.category ?? 'all',
    });

    const stats = useMemo(() => {
        const totals = { total: vehicles?.total ?? 0, available: 0, rented: 0, maintenance: 0 };
        vehicles?.data?.forEach((vehicle) => {
            if (vehicle.status === 'available') totals.available += 1;
            if (vehicle.status === 'rented') totals.rented += 1;
            if (vehicle.status === 'maintenance') totals.maintenance += 1;
        });
        return totals;
    }, [vehicles]);

    const applyFilters = () => {
        get('/vehicles', {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            data,
        });
    };

    const clearFilters = () => {
        setData({
            search: '',
            status: 'all',
            category: 'all',
        });
        get('/vehicles', {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            data: { search: '', status: '', category: '' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Veículos" />
            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Veículos</h1>
                            <p className="text-sm text-slate-600">
                                Gerencie a frota cadastrada no sistema.
                            </p>
                        </div>
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center gap-2 rounded-md bg-[#1f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                        >
                            + Cadastrar Veículo
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total de veículos" value={stats.total} />
                        <StatCard label="Disponíveis" value={stats.available} valueClass="text-emerald-600" />
                        <StatCard label="Locados" value={stats.rented} valueClass="text-blue-600" />
                        <StatCard
                            label="Em manutenção"
                            value={stats.maintenance}
                            valueClass="text-amber-600"
                        />
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Filtros
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="relative w-full md:max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    placeholder="Buscar por placa ou modelo..."
                                    className="h-10 rounded-md bg-white pl-10"
                                />
                            </div>

                            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger className="h-10 w-full md:w-44">
                                        <SelectValue placeholder="Status: Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Status: Todos</SelectItem>
                                        <SelectItem value="available">Disponível</SelectItem>
                                        <SelectItem value="rented">Locado</SelectItem>
                                        <SelectItem value="maintenance">Em manutenção</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={data.category}
                                    onValueChange={(value) => setData('category', value)}
                                >
                                    <SelectTrigger className="h-10 w-full md:w-48">
                                        <SelectValue placeholder="Categoria: Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Categoria: Todas</SelectItem>
                                        <SelectItem value="SUV">SUV</SelectItem>
                                        <SelectItem value="Hatch">Hatch</SelectItem>
                                        <SelectItem value="Sedan">Sedan</SelectItem>
                                        <SelectItem value="Pickup">Pickup</SelectItem>
                                        <SelectItem value="Luxo">Luxo</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex gap-2 md:ml-auto">
                                    <Button
                                        type="button"
                                        onClick={applyFilters}
                                        className="h-10 gap-2 rounded-md bg-[#2f62de] px-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.25)] transition-colors hover:bg-[#244ec1]"
                                        disabled={processing}
                                    >
                                        <Filter className="h-4 w-4" />
                                        Aplicar Filtros
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={clearFilters}
                                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        disabled={processing}
                                    >
                                        Limpar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Resultados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Foto</TableHead>
                                        <TableHead>Modelo</TableHead>
                                        <TableHead>Placa</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles?.data?.map((vehicle) => (
                                        <TableRow key={vehicle.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <img
                                                    src={
                                                        vehicle.photo_url ??
                                                        'https://via.placeholder.com/48x48?text=Car'
                                                    }
                                                    alt={`${vehicle.model}`}
                                                    className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900">
                                                {vehicle.brand} {vehicle.model}
                                            </TableCell>
                                            <TableCell className="text-slate-700">{vehicle.plate}</TableCell>
                                            <TableCell className="text-slate-700">{vehicle.category ?? '—'}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusColor[vehicle.status] ?? 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusLabel[vehicle.status] ?? vehicle.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-3 text-sm font-semibold text-[#2f62de]">
                                                    <Link href={`/vehicles/${vehicle.id}`}>Visualizar</Link>
                                                    <span className="text-slate-300">•</span>
                                                    <Link href={`/vehicles/${vehicle.id}/edit`}>Editar</Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {vehicles?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-slate-600">
                                                Nenhum veículo encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row">
                                <div>
                                    {vehicles?.from ?? 0}–{vehicles?.to ?? 0} de {vehicles?.total ?? 0} veículos
                                </div>
                                <div className="flex items-center gap-2">
                                    <PageLink
                                        href={findLink(vehicles?.links, 'Anterior') ?? undefined}
                                        disabled={!findLink(vehicles?.links, 'Anterior')}
                                        ariaLabel="Anterior"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </PageLink>
                                    {vehicles?.links
                                        ?.filter((l) => l.label && !l.label.includes('Previous') && !l.label.includes('Next'))
                                        .map((link) => (
                                            <PageLink
                                                key={link.label}
                                                href={link.url ?? undefined}
                                                active={link.active}
                                            >
                                                {stripTags(link.label)}
                                            </PageLink>
                                        ))}
                                    <PageLink
                                        href={findLink(vehicles?.links, 'Próximo') ?? undefined}
                                        disabled={!findLink(vehicles?.links, 'Próximo')}
                                        ariaLabel="Próximo"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </PageLink>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-semibold ${valueClass ?? 'text-slate-900'}`}>{value}</p>
        </div>
    );
}

function PageLink({
    href,
    children,
    active,
    disabled,
    ariaLabel,
}: {
    href?: string;
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}) {
    if (!href || disabled) {
        return (
            <span
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400"
                aria-label={ariaLabel}
            >
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm ${
                active
                    ? 'border-[#2f62de] bg-[#2f62de] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            aria-label={ariaLabel}
        >
            {children}
        </Link>
    );
}

function findLink(
    links: { url: string | null; label: string; active: boolean }[] | undefined,
    labelText: string,
): string | null {
    return links?.find((l) => l.label?.toLowerCase().includes(labelText.toLowerCase()))?.url ?? null;
}

function stripTags(value: string) {
    return value.replace(/<[^>]+>/g, '');
}
