import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <>
            <Head title="Entrar" />

            <div className="flex min-h-screen bg-[#eef3fb]">
                <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:flex">
                    <img
                        src="/images/login-hero.jpg"
                        alt="Carro esportivo azul"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-900/90" />

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 text-white lg:p-12 xl:p-16">
                        <div className="space-y-4">
                            <h1 className="max-w-xl text-3xl font-semibold leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
                                Sistema de Gerenciamento de Locação de
                                Veículos
                            </h1>
                        </div>

                        <p className="text-sm text-white/70">
                            Acesso restrito a usuários autorizados.
                        </p>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-12">
                    <div className="w-full max-w-[430px] rounded-[14px] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sm:p-9">
                        <div className="mb-6 space-y-2 text-center lg:text-left">
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Entrar no Sistema
                            </h2>
                            <p className="text-[15px] text-slate-500">
                                Acesse sua conta de funcionário ou administrador.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-semibold text-slate-800"
                                            >
                                                E-mail
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="exemplo@empresa.com"
                                                    className="h-11 rounded-md border-slate-200 bg-[#f9fbff] pl-10 text-[15px] text-slate-800 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.email}
                                                className="text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-semibold text-slate-800"
                                            >
                                                Senha
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Digite sua senha"
                                                    className="h-11 rounded-md border-slate-200 bg-[#f9fbff] pl-10 text-[15px] text-slate-800 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password}
                                                className="text-sm"
                                            />
                                        </div>

                                        {canResetPassword && (
                                            <div className="flex justify-end">
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs font-semibold text-[#2f62de] transition-colors hover:text-[#244ec1]"
                                                    tabIndex={3}
                                                >
                                                    Esqueci minha senha
                                                </TextLink>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-md bg-[#1f56d8] text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="size-5 animate-spin" />
                                        )}
                                        Entrar
                                    </Button>
                                </>
                            )}
                        </Form>

                        <div className="mt-4">
                            <Button
                                asChild
                                variant="secondary"
                                className="h-12 w-full rounded-md border border-slate-200 bg-white text-[15px] font-semibold text-slate-800 shadow-none transition-colors hover:bg-slate-50"
                                tabIndex={5}
                            >
                                <Link href={register()}>Criar conta</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
