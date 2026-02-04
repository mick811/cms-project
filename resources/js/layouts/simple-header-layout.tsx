import { Footer } from '@/components/footer';
import Header from '@/components/header';

interface SimpleHeaderLayoutProps {
    children: React.ReactNode;
}

export default function SimpleHeaderLayout({
    children,
}: SimpleHeaderLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="pt-16">
                <Header />
                {children}
            </div>
            <Footer />
        </div>
    );
}
