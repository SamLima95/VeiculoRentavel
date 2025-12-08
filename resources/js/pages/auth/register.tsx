import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, UserRound } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Registrar" />

            <div className="flex min-h-screen bg-[#eef3fb]">
                <div className="relative hidden w-2/5 min-w-[340px] overflow-hidden bg-slate-900 lg:flex">
                    <img
                        src="/images/login-hero.jpg"
                        alt="Carro esportivo azul"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/75 to-slate-900/90" />

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 text-white lg:p-10">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold leading-snug drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
                                Gerencie sua frota com eficiência e precisão.
                            </h2>
                            <p className="text-sm text-white/75">
                                Plataforma completa para o gerenciamento de
                                locação de veículos.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-3/5 lg:p-12">
                    <div className="w-full max-w-[520px] rounded-[14px] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sm:p-9">
                        <div className="mb-6 space-y-2 text-center lg:text-left">
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Registrar Novo Funcionário
                            </h1>
                            <p className="text-[15px] text-slate-500">
                                Preencha os dados para criar uma nova conta.
                            </p>
                        </div>

                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-sm font-semibold text-slate-800"
                                            >
                                                Nome Completo
                                            </Label>
                                            <div className="relative">
                                                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Nome e Sobrenome"
                                                    className="h-11 rounded-md border-slate-200 bg-[#f9fbff] pl-10 text-[15px] text-slate-800 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.name}
                                                className="text-sm"
                                            />
                                        </div>

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
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
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
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Crie sua senha"
                                                    className="h-11 rounded-md border-slate-200 bg-[#f9fbff] pl-10 text-[15px] text-slate-800 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password}
                                                className="text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password_confirmation"
                                                className="text-sm font-semibold text-slate-800"
                                            >
                                                Confirmar Senha
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Confirme sua senha"
                                                    className="h-11 rounded-md border-slate-200 bg-[#f9fbff] pl-10 text-[15px] text-slate-800 placeholder:text-slate-400"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password_confirmation}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-md bg-[#1f56d8] text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(33,101,214,0.35)] transition-colors hover:bg-[#1c4cc5]"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="size-5 animate-spin" />
                                        )}
                                        Registrar
                                    </Button>

                                    <div className="text-center text-sm text-slate-500">
                                        Já tenho conta,{' '}
                                        <TextLink href={login()} tabIndex={6}>
                                            fazer login
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
