type OrderStatus = 'OPEN' | 'IN_PROGRESS' | 'FINISHED';

const STATUS_COLORS: Record<OrderStatus, string> = {
    OPEN: 'bg-yellow-400',
    IN_PROGRESS: 'bg-blue-400',
    FINISHED: 'bg-green-500',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    OPEN: 'Aberta',
    IN_PROGRESS: 'Em Andamento',
    FINISHED: 'Finalizada',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`px-2 py-1 text-white rounded text-xs font-semibold ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}