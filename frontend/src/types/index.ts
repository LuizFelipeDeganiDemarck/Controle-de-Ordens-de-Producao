export type Product = {
    id: number;
    name: string;
    sku: string;
};

export type Order = {
    id: number;
    orderNumber: string;
    productId: number;
    targetQuantity: number;
    status: "OPEN" | "IN_PROGRESS" | "FINISHED";
};

export type Record = {
    id: number;
    type: "GOOD" | "SCRAP";
    quantity: number;
    note?: string;
};