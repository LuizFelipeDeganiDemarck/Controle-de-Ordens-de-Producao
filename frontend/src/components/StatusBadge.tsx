export default function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        OPEN: "bg-yellow-400",
        IN_PROGRESS: "bg-blue-400",
        FINISHED: "bg-green-500",
    };

    const labels: any = {
        OPEN: "Aberta",
        IN_PROGRESS: "Em Andamento",
        FINISHED: "Finalizada",
    };

    return (
        <span className={`px-2 py-1 text-white rounded ${colors[status]}`}>
            {labels[status]}
        </span>
    );
}