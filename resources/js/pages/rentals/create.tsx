import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarClock, CarFront, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Locacoes', href: '/rentals' },
    { title: 'Nova', href: '/rentals/create' },
];

type Option = { id: number; label: string };

type RentalFormProps = {
    clients?: Option[];
    vehicles?: Option[];
};

export default function RentalCreate({ clients = [], vehicles = [] }: RentalFormProps) {
    const { data, setData, post, processing } = useForm({
        client_id: clients[0]?.id ?? '',
        vehicle_id: vehicles[0]?.id ?? '',
        start_date: '',
        end_date: '',
        status: 'draft',
        rate: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/rentals');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Locacao" />

            <form onSubmit={handleSubmit}>
                <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">Nova Locacao</h1>
                            <p className="text-sm text-slate-600">
                                Cadastre uma locacao informando cliente, veiculo e periodo.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/rentals"
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </Link>
                            <Button
                                type="submit"
                                className="bg-[#1f56d8] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                disabled={processing}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Dados da locacao
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <UserRound className="h-4 w-4 text-blue-600" />
                                        Cliente
                                    </Label>
                                    <Select
                                        value={String(data.client_id)}
                                        onValueChange={(value) => setData('client_id', value)}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecione o cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client) => (
                                                <SelectItem key={client.id} value={String(client.id)}>
                                                    {client.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <CarFront className="h-4 w-4 text-emerald-600" />
                                        Veiculo
                                    </Label>
                                    <Select
                                        value={String(data.vehicle_id)}
                                        onValueChange={(value) => setData('vehicle_id', value)}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecione o veiculo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((vehicle) => (
                                                <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                                                    {vehicle.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <CalendarClock className="h-4 w-4 text-indigo-600" />
                                        Inicio
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <CalendarClock className="h-4 w-4 text-indigo-600" />
                                        Fim
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="mb-1 text-sm font-semibold text-slate-800">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Rascunho</SelectItem>
                                            <SelectItem value="in_progress">Em andamento</SelectItem>
                                            <SelectItem value="finished">Finalizada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="mb-1 text-sm font-semibold text-slate-800">Valor estimado</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={data.rate}
                                        onChange={(e) => setData('rate', e.target.value)}
                                        placeholder="Ex: 350.00"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </AppLayout>
    );
}
