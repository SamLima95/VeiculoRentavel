import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, UploadCloud } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { type FormEvent, type ReactNode } from 'react';

type VehicleFormProps = {
    vehicle?: {
        id: number;
        model?: string;
        brand?: string;
        year?: number;
        color?: string;
        plate?: string;
        mileage?: number;
        category?: string;
        status?: string;
        renavam?: string;
        licensing_date?: string;
        ipva_date?: string;
        insurance_name?: string;
        policy_number?: string;
        claim_notes?: string;
        daily_rate?: number;
    };
};

export default function VehicleForm({ vehicle }: VehicleFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Veículos', href: '/vehicles' },
        { title: vehicle ? 'Editar' : 'Cadastrar', href: vehicle ? `/vehicles/${vehicle.id}/edit` : '/vehicles/create' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        model: vehicle?.model ?? '',
        brand: vehicle?.brand ?? '',
        year: vehicle?.year?.toString() ?? '',
        color: vehicle?.color ?? '',
        plate: vehicle?.plate ?? '',
        mileage: vehicle?.mileage?.toString() ?? '',
        category: vehicle?.category ?? 'compact',
        status: vehicle?.status ?? 'available',
        renavam: vehicle?.renavam ?? '',
        licensing_date: vehicle?.licensing_date ?? '',
        ipva_date: vehicle?.ipva_date ?? '',
        insurance_name: vehicle?.insurance_name ?? '',
        policy_number: vehicle?.policy_number ?? '',
        claim_notes: vehicle?.claim_notes ?? '',
        daily_rate: vehicle?.daily_rate?.toString() ?? '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (vehicle) {
            put(`/vehicles/${vehicle.id}`);
        } else {
            post('/vehicles');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={vehicle ? 'Editar Veículo' : 'Cadastrar Veículo'} />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                {vehicle ? 'Edição de Veículo' : 'Cadastro de Veículo'}
                            </h1>
                            <p className="text-sm text-slate-600">
                                Preencha os dados do veículo para incluí-lo na frota.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/vehicles"
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </Link>
                            <Button
                                type="submit"
                                className="bg-[#1f56d8] px-5 text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                disabled={processing}
                            >
                                {vehicle ? 'Salvar alterações' : 'Salvar'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <CardSection title="Dados do Veículo">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Field label="Modelo" error={errors.model}>
                                    <Input
                                        placeholder="Ex: Onix Plus"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                    />
                                </Field>
                                <Field label="Marca" error={errors.brand}>
                                    <Input
                                        placeholder="Ex: Chevrolet"
                                        value={data.brand}
                                        onChange={(e) => setData('brand', e.target.value)}
                                    />
                                </Field>
                                <Field label="Ano" error={errors.year}>
                                    <Input
                                        type="number"
                                        placeholder="Ex: 2023"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                    />
                                </Field>
                                <Field label="Cor" error={errors.color}>
                                    <Input
                                        placeholder="Ex: Prata"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                    />
                                </Field>
                                <Field label="Placa" error={errors.plate}>
                                    <Input
                                        placeholder="Ex: BRA2E19"
                                        value={data.plate}
                                        onChange={(e) => setData('plate', e.target.value)}
                                    />
                                </Field>
                                <Field label="Quilometragem" error={errors.mileage}>
                                    <Input
                                        placeholder="Ex: 15.000"
                                        value={data.mileage}
                                        onChange={(e) => setData('mileage', e.target.value)}
                                    />
                                </Field>
                                <Field label="Diaria (R$)" error={errors.daily_rate}>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Ex: 199.90"
                                        value={data.daily_rate}
                                        onChange={(e) => setData('daily_rate', e.target.value)}
                                    />
                                </Field>
                                <Field label="Categoria" error={errors.category}>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="compact">Compacto</SelectItem>
                                            <SelectItem value="sedan">Sedan</SelectItem>
                                            <SelectItem value="suv">SUV</SelectItem>
                                            <SelectItem value="pickup">Pickup</SelectItem>
                                            <SelectItem value="luxury">Luxo</SelectItem>
                                            <SelectItem value="hatch">Hatch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Status" error={errors.status}>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponivel</SelectItem>
                                            <SelectItem value="rented">Locado</SelectItem>
                                            <SelectItem value="maintenance">Manutencao</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </CardSection>

                        <CardSection title="Documentação">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Field label="Renavam" error={errors.renavam}>
                                    <Input
                                        placeholder="00000000000"
                                        value={data.renavam}
                                        onChange={(e) => setData('renavam', e.target.value)}
                                    />
                                </Field>
                                <Field
                                    label={
                                        <div className="flex items-center gap-2">
                                            <span>Licenciamento</span>
                                            <Badge
                                                variant="destructive"
                                                className="rounded-full bg-red-100 text-[11px] font-semibold text-red-600 hover:bg-red-100"
                                            >
                                                Vencido
                                            </Badge>
                                        </div>
                                    }
                                    error={errors.licensing_date}
                                >
                                    <Input
                                        type="date"
                                        placeholder="10/31/2023"
                                        value={data.licensing_date}
                                        onChange={(e) => setData('licensing_date', e.target.value)}
                                    />
                                </Field>
                                <Field label="IPVA" error={errors.ipva_date}>
                                    <Input
                                        type="date"
                                        placeholder="12/15/2024"
                                        value={data.ipva_date}
                                        onChange={(e) => setData('ipva_date', e.target.value)}
                                    />
                                </Field>
                            </div>
                        </CardSection>

                        <CardSection
                            title="Seguro e Sinistros"
                            badge={
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                                >
                                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                                    Histórico de sinistro
                                </Button>
                            }
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Nome da Seguradora" error={errors.insurance_name}>
                                    <Input
                                        placeholder="Ex: Porto Seguro"
                                        value={data.insurance_name}
                                        onChange={(e) => setData('insurance_name', e.target.value)}
                                    />
                                </Field>
                                <Field label="Número da Apólice" error={errors.policy_number}>
                                    <Input
                                        placeholder="000.0000.000.000"
                                        value={data.policy_number}
                                        onChange={(e) => setData('policy_number', e.target.value)}
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Observações de Sinistro" error={errors.claim_notes}>
                                        <Textarea
                                            placeholder="Registre sinistros anteriores aqui..."
                                            className="min-h-[100px]"
                                            value={data.claim_notes}
                                            onChange={(e) => setData('claim_notes', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </CardSection>

                        <CardSection title="Fotos do Veículo">
                            <div className="grid gap-4 lg:grid-cols-[1fr]">
                                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                        <UploadCloud className="h-6 w-6" />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-slate-800">
                                        Arraste e solte ou{' '}
                                        <button
                                            type="button"
                                            className="text-[#1f56d8] underline-offset-4 hover:underline"
                                        >
                                            clique para adicionar
                                        </button>
                                    </p>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF até 10MB</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {[
                                        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400',
                                        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=401',
                                        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=402',
                                    ].map((src, index) => (
                                        <div
                                            key={index}
                                            className="h-28 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm"
                                        >
                                            <img
                                                src={src}
                                                alt={`Foto ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardSection>
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:justify-end sm:px-6">
                        <Link
                            href="/vehicles"
                            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            Cancelar
                        </Link>
                        <Button
                            type="submit"
                            className="bg-[#1f56d8] px-5 text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            disabled={processing}
                        >
                            {vehicle ? 'Salvar Veículo' : 'Salvar Veículo'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function CardSection({
    title,
    children,
    badge,
}: {
    title: string;
    children: ReactNode;
    badge?: ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                </div>
                {badge}
            </div>
            {children}
        </section>
    );
}

function Field({
    label,
    children,
    error,
}: {
    label: ReactNode;
    children: ReactNode;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            {label && <Label className="text-sm font-semibold text-slate-800">{label}</Label>}
            {children}
            <InputError message={error} />
        </div>
    );
}
