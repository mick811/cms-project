import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home, Package } from 'lucide-react';
import SimpleHeaderLayout from '@/layouts/simple-header-layout';

interface ErrorPageProps {
    status: number;
    message?: string;
}

export default function Error({ status, message }: ErrorPageProps) {
    const getErrorContent = () => {
        switch (status) {
            case 404:
                return {
                    icon: Package,
                    title: 'Page Not Found',
                    description:
                        "Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.",
                };
            case 500:
                return {
                    icon: AlertCircle,
                    title: 'Server Error',
                    description:
                        'Something went wrong on our end. Please try again later or contact support if the problem persists.',
                };
            case 503:
                return {
                    icon: AlertCircle,
                    title: 'Service Unavailable',
                    description:
                        'Our service is temporarily unavailable. Please check back in a few moments.',
                };
            default:
                return {
                    icon: AlertCircle,
                    title: 'An Error Occurred',
                    description:
                        message ||
                        'Something unexpected happened. Please try again.',
                };
        }
    };

    const { icon: Icon, title, description } = getErrorContent();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
            <Head title={`${status} - ${title}`} />

            <div className="flex flex-col items-center gap-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-6xl font-light tracking-tight text-foreground">
                        {status}
                    </h1>
                    <h2 className="text-2xl font-medium tracking-tight">
                        {title}
                    </h2>
                    <p className="mx-auto max-w-md text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xs bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 rounded-xs border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                        <Package className="h-4 w-4" />
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}

Error.layout = (page: React.ReactNode) => (
    <SimpleHeaderLayout>{page}</SimpleHeaderLayout>
);
