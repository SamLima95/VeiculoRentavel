import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    FileUp,
    MapPin,
    Shield,
    UserRound,
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
import InputError from '@/components/input-error';
import { type FormEvent, type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: '/clients' },
    { title: 'Cadastrar', href: '/clients/create' },
];

export default function CreateClient() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        cpf: '',
        rg: '',
        phone: '',
        email: '',
        birth_date: '',
        status: 'active',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        cnh_number: '',
        cnh_category: 'A',
        cnh_issue_date: '',
        cnh_expiry_date: '',
        cnh_notes: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/clients');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cadastrar Cliente" />

            <div className="-mx-4 bg-[#f4f7fb] px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Cadastrar Cliente
                            </h1>
                            <p className="text-sm text-slate-600">
                                Preencha os dados do cliente para incluí-lo na base.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/clients"
                                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </Link>
                            <Button
                                type="submit"
                                className="bg-[#1f56d8] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                disabled={processing}
                            >
                                Salvar Cliente
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                        <div className="space-y-4">
                            <Section title="Dados Pessoais">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Field label="Nome completo" error={errors.name}>
                                        <Input
                                            placeholder="Digite o nome completo"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="CPF" error={errors.cpf}>
                                            <Input
                                                placeholder="000.000.000-00"
                                                value={data.cpf}
                                                onChange={(e) => setData('cpf', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="RG (Opcional)" error={errors.rg}>
                                            <Input
                                                placeholder="00.000.000-0"
                                                value={data.rg}
                                                onChange={(e) => setData('rg', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Telefone" error={errors.phone}>
                                            <Input
                                                placeholder="(00) 00000-0000"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="E-mail" error={errors.email}>
                                            <Input
                                                type="email"
                                                placeholder="exemplo@email.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Data de Nascimento" error={errors.birth_date}>
                                            <Input
                                                type="date"
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                            />
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
                                                    <SelectItem value="active">Ativo</SelectItem>
                                                    <SelectItem value="inactive">Inativo</SelectItem>
                                                    <SelectItem value="pending">Pendente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Endereço do Cliente" icon={<MapPin className="h-4 w-4" />}>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-4 gap-3">
                                        <Field label="CEP" error={errors.cep}>
                                            <Input
                                                placeholder="00000-000"
                                                value={data.cep}
                                                onChange={(e) => setData('cep', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Rua" className="col-span-3" error={errors.street}>
                                            <Input
                                                placeholder="Nome da rua"
                                                value={data.street}
                                                onChange={(e) => setData('street', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <Field label="Número" error={errors.number}>
                                            <Input
                                                placeholder="123"
                                                value={data.number}
                                                onChange={(e) => setData('number', e.target.value)}
                                            />
                                        </Field>
                                        <Field
                                            label="Complemento (Opcional)"
                                            className="col-span-3"
                                            error={errors.complement}
                                        >
                                            <Input
                                                placeholder="Apto, Bloco, etc."
                                                value={data.complement}
                                                onChange={(e) => setData('complement', e.target.value)}
                                            />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Field label="Bairro" error={errors.neighborhood}>
                                            <Input
                                                placeholder="Nome do bairro"
                                                value={data.neighborhood}
                                                onChange={(e) => setData('neighborhood', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Cidade" error={errors.city}>
                                            <Input
                                                placeholder="Nome da cidade"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Estado" error={errors.state}>
                                            <Input
                                                placeholder="UF"
                                                maxLength={2}
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value.toUpperCase())}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Informações da CNH" icon={<Shield className="h-4 w-4" />}>
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Número da CNH" error={errors.cnh_number}>
                                            <Input
                                                placeholder="00000000000"
                                                value={data.cnh_number}
                                                onChange={(e) => setData('cnh_number', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Categoria" error={errors.cnh_category}>
                                            <Select
                                                value={data.cnh_category}
                                                onValueChange={(value) => setData('cnh_category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">A</SelectItem>
                                                    <SelectItem value="B">B</SelectItem>
                                                    <SelectItem value="C">C</SelectItem>
                                                    <SelectItem value="D">D</SelectItem>
                                                    <SelectItem value="E">E</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Data de Emissão" error={errors.cnh_issue_date}>
                                            <Input
                                                type="date"
                                                value={data.cnh_issue_date}
                                                onChange={(e) => setData('cnh_issue_date', e.target.value)}
                                            />
                                        </Field>
                                        <Field label="Data de Validade" error={errors.cnh_expiry_date}>
                                            <Input
                                                type="date"
                                                value={data.cnh_expiry_date}
                                                onChange={(e) => setData('cnh_expiry_date', e.target.value)}
                                                className="aria-invalid:border-red-300"
                                                aria-invalid={
                                                    !!data.cnh_expiry_date &&
                                                    new Date(data.cnh_expiry_date) < new Date()
                                                }
                                            />
                                            {data.cnh_expiry_date &&
                                                new Date(data.cnh_expiry_date) < new Date() && (
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
                                                        <AlertTriangle className="h-3.5 w-3.5" />
                                                        Vencida
                                                    </div>
                                                )}
                                        </Field>
                                    </div>
                                    <Field label="Foto/Scan da CNH (Opcional)" error={errors.cnh_notes}>
                                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                                                <FileUp className="h-5 w-5" />
                                            </div>
                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                Clique para enviar ou arraste e solte
                                            </p>
                                            <p className="text-xs text-slate-500">PNG, JPG ou PDF (máx. 5MB)</p>
                                        </div>
                                        <Textarea
                                            className="mt-2"
                                            placeholder="Observações da CNH (opcional)"
                                            value={data.cnh_notes}
                                            onChange={(e) => setData('cnh_notes', e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </Section>
                        </div>

                        <Card className="h-fit border-slate-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold text-slate-900">
                                    Histórico do Cliente
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    Dados resumidos de relacionamento.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <HistoryItem label="Total de locações" value="12" />
                                <HistoryItem label="Pendências / multas" value="R$ 85,50" highlight />
                                <HistoryItem label="Última locação" value="15/08/2023" />
                                <Button
                                    variant="link"
                                    className="px-0 text-sm font-semibold text-[#1f56d8]"
                                    asChild
                                >
                                    <Link href="#">Ver histórico completo</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                        <Link
                            href="/clients"
                            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            Cancelar
                        </Link>
                        <Button
                            type="submit"
                            className="bg-[#1f56d8] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                            disabled={processing}
                        >
                            Salvar Cliente
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
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

function Field({
    label,
    children,
    error,
    className,
}: {
    label: ReactNode;
    children: ReactNode;
    error?: string;
    className?: string;
}) {
    return (
        <div className={`space-y-1 ${className ?? ''}`}>
            <Label className="text-sm font-semibold text-slate-800">{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

function HistoryItem({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{label}</span>
            <span
                className={`text-sm font-semibold ${
                    highlight ? 'text-amber-600' : 'text-slate-900'
                }`}
            >
                {value}
            </span>
        </div>
    );
}
