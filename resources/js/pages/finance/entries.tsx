import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

type Entry = {
    id: number;
    type: 'receita' | 'despesa';
    description: string;
    category: string;
    date: string;
    amount: string;
    status: 'pago' | 'pendente';
};

type EntriesPageProps = {
    entries?: Entry[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Financeiro', href: '/finance' },
    { title: 'Lancamentos', href: '/finance/entries' },
];

const sampleEntries: Entry[] = [
    { id: 1, type: 'receita', description: 'Locacao - Corolla', category: 'Locacao', date: '10/05/24', amount: 'R$ 850,00', status: 'pago' },
    { id: 2, type: 'despesa', description: 'Manutencao preventiva - HB20', category: 'Manutencao', date: '11/05/24', amount: 'R$ 280,00', status: 'pago' },
    { id: 3, type: 'receita', description: 'Multa reembolsada', category: 'Multas', date: '12/05/24', amount: 'R$ 190,00', status: 'pendente' },
    { id: 4, type: 'despesa', description: 'Seguro frota', category: 'Seguro', date: '13/05/24', amount: 'R$ 1.200,00', status: 'pago' },
];

const statusChip: Record<Entry['status'], string> = {
    pago: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    pendente: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
};

const typeChip: Record<Entry['type'], string> = {
    receita: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    despesa: 'bg-red-100 text-red-700 ring-1 ring-red-200',
};

export default function FinanceEntries({ entries = sampleEntries }: EntriesPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lancamentos Financeiros" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Lancamentos Financeiros</h1>
                        <p className="text-sm text-slate-600">
                            Registre receitas e despesas para manter a conciliacao em dia.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-800">
                            Importar CSV
                        </Button>
                        <Button className="bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] hover:bg-[#1c4cc5]">
                            + Novo lancamento
                        </Button>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-900">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="Buscar por descricao ou categoria" className="h-10 pl-10" />
                        </div>
                        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                            <Select defaultValue="all">
                                <SelectTrigger className="h-10 w-full lg:w-40">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tipo: Todos</SelectItem>
                                    <SelectItem value="receita">Receita</SelectItem>
                                    <SelectItem value="despesa">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="all">
                                <SelectTrigger className="h-10 w-full lg:w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Status: Todos</SelectItem>
                                    <SelectItem value="pago">Pago</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 lg:ml-auto">
                            <Button className="h-10 bg-[#2f62de] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.25)] hover:bg-[#244ec1]">
                                Aplicar filtros
                            </Button>
                            <Button variant="secondary" className="h-10 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                                Limpar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Descricao</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Acoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-slate-50">
                                        <TableCell>
                                            <Badge className={`${typeChip[entry.type]} px-3 py-1 text-[13px] font-medium`}>
                                                {entry.type === 'receita' ? 'Receita' : 'Despesa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900">
                                            {entry.description}
                                        </TableCell>
                                        <TableCell className="text-slate-700">{entry.category}</TableCell>
                                        <TableCell className="text-slate-700">{entry.date}</TableCell>
                                        <TableCell className="text-slate-800">{entry.amount}</TableCell>
                                        <TableCell>
                                            <Badge className={`${statusChip[entry.status]} px-3 py-1 text-[13px] font-medium`}>
                                                {entry.status === 'pago' ? 'Pago' : 'Pendente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-semibold text-[#1f56d8]">
                                            <Link href="#" className="hover:underline">Editar</Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {entries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-6 text-center text-slate-600">
                                            Nenhum lancamento encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                            <p>Mostrando {entries.length} de {entries.length} lancamentos</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="border-slate-200 text-slate-700">
                                    Anterior
                                </Button>
                                <Button className="bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(33,101,214,0.3)] hover:bg-[#1c4cc5]">
                                    Proximo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
