import { cn } from '@/lib/utils';

interface InfoRowProps {
    label: string;
    value: string | number | null | undefined;
    className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between text-[11px] tracking-wide uppercase',
                className,
            )}
        >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value ?? '—'}</span>
        </div>
    );
}
