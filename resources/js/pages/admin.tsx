import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administração',
        href: '/admin',
    },
];

export default function Admin() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administração" />
            <div className="space-y-4">
                <h1>Administração</h1>
            </div>
        </AppLayout>
    );
}
