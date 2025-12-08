import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Camera,
    CarFront,
    CheckCircle2,
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
    { title: 'Check-out', href: '/rentals/check-out' },
];

export default function RentalCheckOut() {
    const { data, setData, post, processing } = useForm({
        fuel_start: '3/4',
        fuel_end: '1/2',
        mileage_start: '15480',
        mileage_end: '',
        damages: [{ type: 'Arranhão', value: '350' }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/rentals/check-out');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-out — Devolução do Veículo" />

            <form onSubmit={handleSubmit}>
                <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Check-out — Devolução do Veículo
                            </h1>
                            <p className="text-sm text-slate-600">
                                Compare a retirada, registre avarias e finalize a cobrança.
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
                                Finalizar Check-out
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <Section title="1. Vistoria de Retorno" icon={<CarFront className="h-4 w-4" />}>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900"
                                            alt="Veículo"
                                            className="h-40 w-full rounded-lg object-cover ring-1 ring-slate-200"
                                        />
                                        <p className="text-xs text-slate-600">Fotos do Check-in</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Camera className="h-6 w-6 text-slate-400" />
                                                Fotos de Retorno
                                                <span className="text-xs text-slate-500">
                                                    Faça upload das fotos de retorno
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600">Galeria de fotos da devolução</p>
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        { label: 'Pneus OK', key: 'pneus' },
                                        { label: 'Lataria OK', key: 'lataria' },
                                        { label: 'Interior OK', key: 'interior' },
                                        { label: 'Outros Itens OK', key: 'outros' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-2 text-sm text-slate-800">
                                            <Checkbox />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-sm font-semibold text-slate-800">Observações</Label>
                                    <Textarea placeholder="Registre observações da vistoria de retorno..." />
                                </div>
                            </div>
                        </Section>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Section title="2. Combustível" icon={<Fuel className="h-4 w-4" />}>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-slate-500">
                                        Nível na Retirada
                                    </Label>
                                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                                        {data.fuel_start}
                                    </div>
                                    <Label className="text-xs font-semibold uppercase text-slate-500">
                                        Nível no Retorno
                                    </Label>
                                    <Select
                                        value={data.fuel_end}
                                        onValueChange={(value) => setData('fuel_end', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tank_full">Cheio</SelectItem>
                                            <SelectItem value="3/4">3/4</SelectItem>
                                            <SelectItem value="1/2">1/2</SelectItem>
                                            <SelectItem value="1/4">1/4</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                        Combustível abaixo do registrado → aplicar taxa automática.
                                    </div>
                                </div>
                            </Section>

                            <Section title="3. Quilometragem" icon={<Gauge className="h-4 w-4" />}>
                                <div className="grid gap-2 text-sm text-slate-800">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="KM inicial">
                                            <Input
                                                value={data.mileage_start}
                                                onChange={(e) => setData('mileage_start', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="KM final">
                                            <Input
                                                value={data.mileage_end}
                                                onChange={(e) => setData('mileage_end', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-semibold text-red-600">
                                        <span>50 KM</span>
                                        <span>Excedente (franquia: 50,00KM)</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                                        <span>Valor extra por KM</span>
                                        <span>R$ 50,00</span>
                                    </div>
                                </div>
                            </Section>

                            <Section title="4. Avarias / Sinistros" icon={<AlertTriangle className="h-4 w-4 text-red-500" />}>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Tipo de dano">
                                            <Input value={data.damages[0].type} readOnly />
                                        </Field>
                                        <Field label="Valor Estimado da Avaria">
                                            <Input
                                                value={data.damages[0].value}
                                                onChange={(e) =>
                                                    setData('damages', [
                                                        { ...data.damages[0], value: e.target.value },
                                                    ])
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="px-0 text-sm font-semibold text-[#1f56d8]"
                                    >
                                        + Adicionar Fotos da Avaria
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="px-0 text-sm font-semibold text-[#1f56d8]"
                                    >
                                        + Adicionar Nova Avaria
                                    </Button>
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Checkbox />
                                        Sinistro (acidente)
                                    </div>
                                </div>
                            </Section>
                        </div>

                        <Section title="5. Fechamento Financeiro" icon={<Info className="h-4 w-4" />}>
                            <div className="space-y-2 text-sm text-slate-800">
                                <LineItem label="Diárias" value="R$ 450,00" />
                                <LineItem label="KM excedente" value="R$ 50,00" />
                                <LineItem label="Taxa de Combustível" value="R$ 20,00" />
                                <LineItem label="Avarias" value="R$ 350,00" />
                                <LineItem label="Descontos" value="R$ 0,00" />
                                <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                                    <span className="text-sm font-semibold text-slate-700">Total Final</span>
                                    <span className="text-xl font-bold text-[#1f56d8]">R$ 930,00</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                                >
                                    Gerar Recibo
                                </Button>
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
                            Finalizar Check-out e Fechar Locação
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
                    <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
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

function LineItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
        </div>
    );
}
