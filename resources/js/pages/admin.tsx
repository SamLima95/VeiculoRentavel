import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Clock,
    KeyRound,
    Plus,
    Search,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type ComponentType, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administracao',
        href: '/admin',
    },
];

type Metric = {
    label: string;
    value: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    helper?: string;
};

type UserRow = {
    name: string;
    email: string;
    role: 'Administrador' | 'Operador' | 'Financeiro' | 'Auditoria';
    status: 'Ativo' | 'Inativo' | 'Pendente';
    lastAccess: string;
};

type AuditRow = {
    user: string;
    action: string;
    detail: string;
    time: string;
    ip: string;
};

const metrics: Metric[] = [
    {
        label: 'Usuarios',
        value: '32',
        icon: UserRound,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        helper: 'Total cadastrados',
    },
    {
        label: 'Administradores',
        value: '5',
        icon: ShieldCheck,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        helper: 'Com acesso total',
    },
    {
        label: 'Ativos',
        value: '27',
        icon: Activity,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        helper: 'Logins nas ultimas 72h',
    },
    {
        label: 'Pendentes',
        value: '3',
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        helper: 'Convites aguardando',
    },
];

const users: UserRow[] = [
    {
        name: 'Ana Souza',
        email: 'ana.souza@acme.com',
        role: 'Administrador',
        status: 'Ativo',
        lastAccess: 'Hoje, 09:12',
    },
    {
        name: 'Bruno Martins',
        email: 'bruno.martins@acme.com',
        role: 'Financeiro',
        status: 'Ativo',
        lastAccess: 'Hoje, 08:47',
    },
    {
        name: 'Carlos Pereira',
        email: 'carlos.pereira@acme.com',
        role: 'Operador',
        status: 'Pendente',
        lastAccess: 'Convite enviado',
    },
    {
        name: 'Daniela Lima',
        email: 'daniela.lima@acme.com',
        role: 'Auditoria',
        status: 'Ativo',
        lastAccess: 'Ontem, 18:05',
    },
    {
        name: 'Eduardo Silva',
        email: 'eduardo.silva@acme.com',
        role: 'Operador',
        status: 'Inativo',
        lastAccess: 'Ha 12 dias',
    },
];

const audits: AuditRow[] = [
    {
        user: 'Ana Souza',
        action: 'Criou usuario',
        detail: 'Convite enviado para joao.santos@acme.com',
        time: 'Hoje, 09:18',
        ip: '187.33.10.4',
    },
    {
        user: 'Bruno Martins',
        action: 'Exportou relatorio',
        detail: 'Financeiro - ultimo mes (CSV)',
        time: 'Hoje, 08:55',
        ip: '187.33.10.4',
    },
    {
        user: 'Daniela Lima',
        action: 'Atualizou permissao',
        detail: 'Perfil de operador para usuario: carlos.pereira@acme.com',
        time: 'Ontem, 18:02',
        ip: '189.21.44.8',
    },
    {
        user: 'Eduardo Silva',
        action: 'Login negado',
        detail: 'Conta desativada',
        time: 'Ontem, 07:41',
        ip: '177.92.10.22',
    },
];

const roleBadge: Record<UserRow['role'], string> = {
    Administrador: 'bg-slate-100 text-slate-800',
    Operador: 'bg-blue-100 text-blue-700',
    Financeiro: 'bg-emerald-100 text-emerald-700',
    Auditoria: 'bg-amber-100 text-amber-700',
};

const statusBadge: Record<UserRow['status'], string> = {
    Ativo: 'bg-emerald-100 text-emerald-700',
    Inativo: 'bg-slate-200 text-slate-700',
    Pendente: 'bg-amber-100 text-amber-700',
};

export default function Admin() {
    const [roleFilter, setRoleFilter] = useState<'all' | UserRow['role']>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | UserRow['status']>('all');
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchRole = roleFilter === 'all' || user.role === roleFilter;
            const matchStatus = statusFilter === 'all' || user.status === statusFilter;
            const term = search.trim().toLowerCase();
            const matchTerm =
                !term ||
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term);
            return matchRole && matchStatus && matchTerm;
        });
    }, [roleFilter, statusFilter, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administracao" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Administracao</h1>
                        <p className="text-sm text-slate-600">
                            Controle de usuarios, funcoes e rastreabilidade de acessos.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        >
                            <KeyRound className="h-4 w-4" />
                            Convidar usuario
                        </Button>
                        <Button className="gap-2 bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(33,101,214,0.3)] hover:bg-[#1c4cc5]">
                            <Plus className="h-4 w-4" />
                            Novo usuario
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <Card key={metric.label} className="border-slate-200 shadow-sm">
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-slate-500">{metric.label}</p>
                                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                                {metric.value}
                                            </p>
                                            {metric.helper && (
                                                <p className="text-xs text-slate-500">{metric.helper}</p>
                                            )}
                                        </div>
                                        <span className={`rounded-full p-3 ${metric.bg}`}>
                                            <Icon className={`h-5 w-5 ${metric.color}`} />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="border-slate-200 shadow-sm lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Gestao de usuarios
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Gerencie perfis, acessos e status das contas.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                                        <span className="text-slate-500">Funcao:</span>
                                        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as typeof roleFilter)}>
                                            <SelectTrigger className="h-8 w-[150px] border-none px-0 text-sm shadow-none focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todas</SelectItem>
                                                <SelectItem value="Administrador">Administrador</SelectItem>
                                                <SelectItem value="Operador">Operador</SelectItem>
                                                <SelectItem value="Financeiro">Financeiro</SelectItem>
                                                <SelectItem value="Auditoria">Auditoria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                                        <span className="text-slate-500">Status:</span>
                                        <Select
                                            value={statusFilter}
                                            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
                                        >
                                            <SelectTrigger className="h-8 w-[150px] border-none px-0 text-sm shadow-none focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="Ativo">Ativos</SelectItem>
                                                <SelectItem value="Inativo">Inativos</SelectItem>
                                                <SelectItem value="Pendente">Pendentes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Buscar por nome ou email"
                                        className="h-10 rounded-full border-slate-200 pl-9"
                                    />
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-100">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/80">
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Funcao</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ultimo acesso</TableHead>
                                            <TableHead className="text-right">Acoes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.email} className="hover:bg-slate-50/80">
                                                <TableCell className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 bg-slate-100">
                                                            <AvatarFallback className="font-semibold text-slate-700">
                                                                {user.name
                                                                    .split(' ')
                                                                    .map((part) => part[0])
                                                                    .join('')
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{user.name}</p>
                                                            <p className="text-sm text-slate-600">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${roleBadge[user.role]} px-3 py-1 text-[13px] font-medium`}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${statusBadge[user.status]} px-3 py-1 text-[13px] font-medium`}>
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-700">{user.lastAccess}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href="#"
                                                        className="text-sm font-semibold text-[#1f56d8] hover:underline"
                                                    >
                                                        Gerenciar
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm text-slate-600">
                                    <p>
                                        Exibindo {filteredUsers.length} de {users.length} usuarios
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-200 text-slate-700"
                                        >
                                            Anterior
                                        </Button>
                                        <Button className="bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(33,101,214,0.3)] hover:bg-[#1c4cc5]">
                                            Proximo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Auditoria (logs)
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Rastreabilidade de acoes criticas do sistema.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-slate-100 text-slate-700">Ultimas 24h</Badge>
                                <Badge className="bg-blue-100 text-blue-700">Seguranca</Badge>
                                <Badge className="bg-emerald-100 text-emerald-700">Financeiro</Badge>
                            </div>
                            <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white">
                                {audits.map((log) => (
                                    <div
                                        key={`${log.user}-${log.time}`}
                                        className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-5 sm:items-center"
                                    >
                                        <div className="sm:col-span-2">
                                            <p className="font-semibold text-slate-900">{log.action}</p>
                                            <p className="text-sm text-slate-600">{log.detail}</p>
                                        </div>
                                        <div className="text-sm text-slate-700">
                                            <span className="font-semibold">{log.user}</span>
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{log.time}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-500">IP {log.ip}</div>
                                        <div className="text-right">
                                            <Link
                                                href="#"
                                                className="text-sm font-semibold text-[#1f56d8] hover:underline"
                                            >
                                                Ver detalhes
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
