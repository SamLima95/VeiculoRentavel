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

type Client = {
    id: number;
    name: string;
    cpf?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'pending' | string;
};

type ClientsPageProps = {
    clients: {
        data: Client[];
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
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Clientes', href: '/clients' }];

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

export default function ClientsPage({ clients, filters }: ClientsPageProps) {
    const { data, setData, get, processing } = useForm({
        search: filters?.search ?? '',
        status: filters?.status ?? 'all',
    });

    const stats = {
        total: clients?.total ?? 0,
        active:
            clients?.data?.filter((c) => c.status === 'active').length ?? 0,
        inactive:
            clients?.data?.filter((c) => c.status === 'inactive').length ?? 0,
        pending:
            clients?.data?.filter((c) => c.status === 'pending').length ?? 0,
    };

    const applyFilters = () => {
        get('/clients', {
            preserveScroll: true,
            replace: true,
            data,
        });
    };

    const clearFilters = () => {
        setData({ search: '', status: 'all' });
        get('/clients', {
            preserveScroll: true,
            replace: true,
            data: { search: '', status: '' },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Clientes</h1>
                            <p className="text-sm text-slate-600">
                                Gerencie os clientes cadastrados no sistema.
                            </p>
                        </div>
                        <Link
                            href="/clients/create"
                            className="inline-flex items-center rounded-md bg-[#1f56d8] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                        >
                            + Cadastrar Cliente
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total de clientes" value={stats.total} />
                        <StatCard label="Clientes ativos" value={stats.active} />
                        <StatCard label="Clientes inativos" value={stats.inactive} />
                        <StatCard label="Com pendências" value={stats.pending} />
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
                                    placeholder="Buscar por Nome, CPF ou Telefone"
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
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
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
                                        <TableHead>Nome do Cliente</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients?.data?.map((client) => (
                                        <TableRow key={client.id} className="hover:bg-slate-50">
                                            <TableCell className="font-semibold text-slate-900">
                                                {client.name}
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {client.cpf ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-slate-700">
                                                {client.phone ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusChip[client.status ?? 'pending'] ??
                                                        'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {statusLabel[client.status ?? 'pending'] ?? client.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-semibold text-[#2f62de]">
                                                <Link href={`/clients/${client.id}`}>Ver</Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {clients?.data?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-6 text-center text-slate-600">
                                                Nenhum cliente encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                                <div>
                                    Mostrando {clients?.from ?? 0}-{clients?.to ?? 0} de {clients?.total ?? 0} clientes
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(clients?.links, 'Anterior') ?? '#'}
                                    >
                                        Anterior
                                    </Link>
                                    <Link
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
                                        href={findLink(clients?.links, 'Próximo') ?? '#'}
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
