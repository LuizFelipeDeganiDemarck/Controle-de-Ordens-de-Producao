export default function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        OPEN: "bg-yellow-400",
        IN_PROGRESS: "bg-blue-400",
        FINISHED: "bg-green-500",
    };

    return (
        <span className={`px-2 py-1 text-white rounded ${colors[status]}`}>
            {status}
        </span>
    );
}