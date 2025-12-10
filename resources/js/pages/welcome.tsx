import { dashboard, login, register } from '@/routes';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: { auth: { user: any } }) {
    return (
        <>
            <Head title="Veículo Rentável - Sistema de Gestão" />

            <div className="min-h-screen bg-white dark:bg-white text-gray-900 font-sans">
                {/* Navbar */}
                <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-xl tracking-tight text-gray-900">VeículoRentável</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all"
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-sm"
                                        >
                                            Cadastrar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main>
                    <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                                    <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold tracking-wide uppercase mb-4">
                                        Versão 1.0 Já Disponível
                                    </span>
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                        <span className="block xl:inline">Gestão de Locadora</span>{' '}
                                        <span className="block text-gray-500 xl:inline">simplificada.</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Substitua processos manuais por uma plataforma centralizada e eficiente. Controle frota, clientes, reservas e manutenções em um único lugar, com total segurança e confiabilidade.
                                    </p>
                                    <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-3">
                                        {!auth.user && (
                                            <>
                                                <div className="rounded-md shadow">
                                                    <Link
                                                        href={register()}
                                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg transition-all"
                                                    >
                                                        Começar agora
                                                    </Link>
                                                </div>
                                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                                    <Link
                                                        href={login()}
                                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg transition-all"
                                                    >
                                                        Demonstração
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                        {auth.user && (
                                            <div className="rounded-md shadow">
                                                <Link
                                                    href={dashboard()}
                                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg transition-all"
                                                >
                                                    Ir para o Dashboard
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 text-sm text-gray-400">
                                        <p>Sem cartão de crédito necessário • Cancelamento a qualquer momento</p>
                                    </div>
                                </div>
                                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                                    <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md overflow-hidden bg-gray-50">
                                        <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                                            {/* Abstract UI Representation */}
                                            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="h-8 w-1/3 bg-gray-100 rounded animate-pulse"></div>
                                                    <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse"></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="h-24 bg-gray-50 rounded-md border border-gray-100 p-3">
                                                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                                                        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <div className="h-24 bg-gray-50 rounded-md border border-gray-100 p-3">
                                                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                                                        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                                                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-gray-50 py-16 sm:py-24">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h2 className="text-base font-semibold text-gray-600 tracking-wide uppercase">Funcionalidades</h2>
                                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                                    Tudo o que você precisa.
                                </p>
                                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                                    Gerencie sua locadora com precisão e facilidade com nossos módulos integrados.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
                                {[
                                    {
                                        title: 'Gestão de Veículos',
                                        description: 'Cadastre e monitore sua frota completa. Controle quilometragem, manutenção e disponibilidade em tempo real.',
                                        icon: (
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: 'Controle de Reservas',
                                        description: 'Sistema de agendamento inteligente que previne conflitos e calcula valores e multas automaticamente.',
                                        icon: (
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: 'Cadastro de Clientes',
                                        description: 'Mantenha um histórico detalhado de seus clientes, com validação de documentos e histórico de locações.',
                                        icon: (
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        ),
                                    },
                                ].map((feature, index) => (
                                    <div key={index} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-shadow p-6">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                                        <p className="mt-2 text-base text-gray-500 flex-grow">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="py-16 bg-white overflow-hidden lg:py-24">
                        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                            <div className="relative">
                                <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                    Por que escolher o VeículoRentável?
                                </h2>
                                <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                                    Nossa plataforma foi desenhada pensando nas dores reais de locadoras de veículos.
                                </p>
                            </div>
                            <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                                <div className="relative">
                                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                        Eficiência e Controle Total
                                    </h3>
                                    <p className="mt-3 text-lg text-gray-500">
                                        Diga adeus às planilhas e papéis perdidos. Tenha controle total sobre sua frota, saiba exatamente onde está cada veículo e quando eles precisam de manutenção.
                                    </p>

                                    <dl className="mt-10 space-y-10">
                                        {[
                                            {
                                                name: 'Segurança de Dados',
                                                description: 'Seus dados e de seus clientes protegidos com as melhores práticas de segurança e criptografia.'
                                            },
                                            {
                                                name: 'Relatórios Gerenciais',
                                                description: 'Tome decisões baseadas em dados. Acompanhe o faturamento, taxa de ocupação e performance da frota.'
                                            },
                                        ].map((item) => (
                                            <div key={item.name} className="relative">
                                                <dt>
                                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.name}</p>
                                                </dt>
                                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                                    {item.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                                <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
                                    <div className="relative mx-auto rounded-lg shadow-lg bg-gray-100 p-8">
                                        <div className="space-y-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <div className="h-8 w-24 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gray-900">
                        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                <span className="block">Pronto para modernizar sua locadora?</span>
                                <span className="block text-gray-400 text-2xl mt-2">Comece a usar hoje mesmo.</span>
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-gray-300">
                                Junte-se a locadoras que estão otimizando seus processos e aumentando seus lucros com nossa tecnologia.
                            </p>
                            <Link
                                href={register()}
                                className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 sm:w-auto transition-all"
                            >
                                Criar conta gratuitamente
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg text-gray-900">VeículoRentável</span>
                        </div>
                        <p className="text-center text-base text-gray-400">
                            &copy; 2025 VeículoRentável. Todos os direitos reservados.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
