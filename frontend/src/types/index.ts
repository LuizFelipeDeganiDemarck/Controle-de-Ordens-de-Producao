export type Product = {
    id: number;
    name: string;
    sku: string;
    createdAt: string;
};

export type ProductionRecord = {
    id: number;
    productionOrderId: number;
    type: 'GOOD' | 'SCRAP';
    quantity: number;
    note?: string | null;
    createdAt: string;
};

export type Order = {
    id: number;
    orderNumber: string;
    productId: number;
    targetQuantity: number;
    status: 'OPEN' | 'IN_PROGRESS' | 'FINISHED';
    createdAt: string;
    finishedAt: string | null;
    product?: Product;
    records?: ProductionRecord[];
    totalGood?: number;
    totalScrap?: number;
    progress?: string;
};