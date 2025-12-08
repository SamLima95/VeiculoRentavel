import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CalendarClock,
    CarFront,
    FileUp,
    Fuel,
    Gauge,
    Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Locações', href: '/rentals' },
    { title: 'Check-in', href: '/rentals/check-in' },
];

type ReservationSummary = {
    client: string;
    vehicle: string;
    plate: string;
    period: string;
    category?: string;
    image?: string;
    status?: string;
};

type CheckInPageProps = {
    reservation?: ReservationSummary;
};

export default function RentalCheckIn({ reservation }: CheckInPageProps) {
    const { data, setData, post, processing } = useForm({
        checklist: {
            fr: false,
            tr: false,
            ld: false,
            le: false,
            painel: false,
            farois: false,
            lataria: false,
            pneus: false,
            interior: false,
            vidros: false,
            acessorios: false,
        },
        notes: '',
        fuel: 'tank_full',
        mileage: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/rentals/check-in');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-in — Retirada do Veículo" />

            <form onSubmit={handleSubmit}>
                <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Check-in — Retirada do Veículo
                            </h1>
                            <p className="text-sm text-slate-600">
                                Confirme os dados, registre a vistoria e finalize a entrega.
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
                                Finalizar Check-in
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <Section title="1. Confirmação da Reserva" icon={<CalendarClock className="h-4 w-4" />}>
                            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-2">
                                    <Badge className="rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-200">
                                        Aguardando retirada
                                    </Badge>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {reservation?.vehicle ?? 'Volkswagen Nivus'} • {reservation?.plate ?? 'ABC-1234'}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            Cliente: {reservation?.client ?? 'João da Silva'} | Período: {reservation?.period ?? '13/10/2024 - 15/10/2024'} | Categoria: {reservation?.category ?? 'SUV Compacto'}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-9 w-fit rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                    >
                                        Editar detalhes da reserva
                                    </Button>
                                </div>
                                <img
                                    src={
                                        reservation?.image ??
                                        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900'
                                    }
                                    alt={reservation?.vehicle ?? 'Veículo'}
                                    className="h-32 w-48 rounded-lg object-cover ring-1 ring-slate-200"
                                />
                            </div>
                        </Section>

                        <Section title="2. Vistoria do Veículo" icon={<CarFront className="h-4 w-4" />}>
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-6">
                                    {['Frente', 'Traseira', 'Lateral Dir.', 'Lateral Esq.', 'Painel', 'Interior'].map(
                                        (label) => (
                                            <UploadSlot key={label} label={label} />
                                        ),
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        { key: 'farois', label: 'Faróis' },
                                        { key: 'lataria', label: 'Lataria' },
                                        { key: 'pneus', label: 'Pneus' },
                                        { key: 'interior', label: 'Interior' },
                                        { key: 'vidros', label: 'Vidros' },
                                        { key: 'acessorios', label: 'Acessórios' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-2 text-sm text-slate-800">
                                            <Checkbox
                                                checked={(data.checklist as any)[item.key]}
                                                onCheckedChange={(checked) =>
                                                    setData('checklist', {
                                                        ...data.checklist,
                                                        [item.key]: checked === true,
                                                    })
                                                }
                                            />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm font-semibold text-slate-800">
                                        Observações Adicionais
                                    </Label>
                                    <Textarea
                                        placeholder="Ex: pequeno risco no para-choque traseiro..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="min-h-[90px]"
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="3. Registro de Combustível e KM" icon={<Fuel className="h-4 w-4" />}>
                            <div className="grid gap-3 md:grid-cols-2">
                                <Field label="Combustível">
                                    <Select
                                        value={data.fuel}
                                        onValueChange={(value) => setData('fuel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tank_full">Tanque Cheio</SelectItem>
                                            <SelectItem value="3_4">3/4</SelectItem>
                                            <SelectItem value="half">1/2</SelectItem>
                                            <SelectItem value="1_4">1/4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Quilometragem">
                                    <Input
                                        placeholder="KM atual"
                                        value={data.mileage}
                                        onChange={(e) => setData('mileage', e.target.value)}
                                    />
                                </Field>
                            </div>
                        </Section>

                        <Section title="4. Contrato e Assinatura Digital" icon={<Info className="h-4 w-4" />}>
                            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                                    <div className="space-y-1 text-sm text-slate-700">
                                        <p>
                                            O cliente concorda com os termos de locação, incluindo responsabilização
                                            por danos, multas e uso adequado do veículo. A franquia do seguro contratado
                                            é de R$ 2.500,00. A devolução deve ocorrer até 15/10/2024 às 10:00.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                                    >
                                        Gerar contrato em PDF
                                    </Button>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm font-semibold text-slate-800">
                                        Assinatura Digital do Cliente
                                    </Label>
                                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                                        Área para assinatura
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>

                    <div className="mt-5 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
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
                            Finalizar Check-in e Liberar Veículo
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

function Section({
    title,
    icon,
    children,
}: {
    title: string;
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

function UploadSlot({ label }: { label: string }) {
    return (
        <div className="flex h-28 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-600">
            <FileUp className="mb-2 h-5 w-5 text-slate-400" />
            {label}
        </div>
    );
}
