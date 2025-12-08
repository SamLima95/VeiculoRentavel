import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Financeiro',
        href: '/finance',
    },
];

export default function Finance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financeiro" />
            <div className="space-y-4">
                <h1>Financeiro</h1>
            </div>
        </AppLayout>
    );
}
