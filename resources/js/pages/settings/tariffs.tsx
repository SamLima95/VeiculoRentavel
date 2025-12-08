import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Repeat } from 'lucide-react';
import { type ReactNode } from 'react';

type Tariff = {
    id: number;
    category: string;
    daily: string;
    km_extra: string;
    late_fee: string;
    deposit: string;
};

type Promotion = {
    id: number;
    title: string;
    active: boolean;
    discount: string;
    period: string;
    categories: string;
};

type TariffsPageProps = {
    tariffs?: Tariff[];
    promotions?: Promotion[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Configuração de Tarifas', href: '/settings/tariffs' }];

export default function TariffsPage({
    tariffs = [],
    promotions = [],
}: TariffsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuração de Tarifas" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Configuração de Tarifas</h1>
                        <p className="text-sm text-slate-600">
                            Defina preços por categoria de veículo.
                        </p>
                    </div>
                    <Button className="bg-[#1f56d8] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]">
                        Salvar alterações
                    </Button>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Tarifas por Categoria
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Diária</TableHead>
                                    <TableHead>KM adicional</TableHead>
                                    <TableHead>Taxa de atraso</TableHead>
                                    <TableHead>Caução</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tariffs.map((tariff) => (
                                    <TableRow key={tariff.id} className="hover:bg-slate-50">
                                        <TableCell className="font-semibold text-slate-900">
                                            {tariff.category}
                                        </TableCell>
                                        <TableCell className="text-slate-700">{tariff.daily}</TableCell>
                                        <TableCell className="text-slate-700">{tariff.km_extra}</TableCell>
                                        <TableCell className="text-slate-700">{tariff.late_fee}</TableCell>
                                        <TableCell className="text-slate-700">{tariff.deposit}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 text-sm font-semibold text-[#2f62de]">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-100"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-100"
                                                    title="Duplicar"
                                                >
                                                    <Repeat className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {tariffs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-6 text-center text-slate-600">
                                            Nenhuma tarifa cadastrada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Promoções Sazonais</h2>
                    <Button
                        variant="secondary"
                        className="rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                    >
                        + Criar promoção
                    </Button>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                    {promotions.map((promo) => (
                        <Card key={promo.id} className="border-slate-200 shadow-sm">
                            <CardContent className="space-y-2 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">{promo.title}</p>
                                        <p className="text-sm text-slate-600">
                                            {promo.active ? 'Ativa' : 'Inativa'} - {promo.discount}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        className="rounded-md bg-[#1f56d8] px-3 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                    >
                                        Editar
                                    </Button>
                                </div>
                                <div className="text-xs text-slate-600 space-y-1">
                                    <p>Válida de {promo.period}</p>
                                    <p>Categorias aplicáveis: {promo.categories}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {promotions.length === 0 && (
                        <p className="text-sm text-slate-600">Nenhuma promoção cadastrada.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
