import express, { Request, Response } from 'express';
import { ProductionOrder, ProductionRecord } from '@prisma/client';
import prisma from './prisma.js';

const router = express.Router();

type OrderWithRecords = ProductionOrder & {
    records: ProductionRecord[];
};

function calculateOrderProgress(order: OrderWithRecords) {
    // Filtra todas as ordens GOOD no filter e soma toda quantidade. 
    const totalGood = order.records
        .filter((r) => r.type === 'GOOD')
        .reduce((sum, r) => sum + r.quantity, 0);

    const totalScrap = order.records
        .filter((r) => r.type === 'SCRAP')
        .reduce((sum, r) => sum + r.quantity, 0);

    return { totalGood, totalScrap };
};

router.post('/api/products', async (req: Request, res: Response) => {
    try {
        const { name, sku } = req.body as { name?: string; sku?: string };

        if (!name || !sku) {
            res.status(400).json({ error: 'Nome e SKU são obrigatórios' });
            return;
        }

        const product = await prisma.product.create({
            data: { name, sku },
        });

        res.status(201).json(product);
    } catch (err: any) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'SKU já cadastrado' });
            return;
        }
        res.status(500).json({ error: 'Erro interno ao cadastrar produto' });
    }
});

router.get('/api/products', async (_req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' },
        });
        res.json(products);
    } catch {
        res.status(500).json({ error: 'Erro interno ao listar produtos' });
    }
});

router.post('/api/orders', async (req: Request, res: Response) => {
    try {
        const { order_number, product_id, target_quantity } = req.body as {
            order_number?: string;
            product_id?: number;
            target_quantity?: number;
        };

        if (!order_number || !product_id || !target_quantity || target_quantity <= 0) {
            res.status(400).json({
                error: 'Dados inválidos. Número da ordem, produto e quantidade (> 0) são obrigatórios',
            });
            return;
        }

        const order = await prisma.productionOrder.create({
            data: {
                orderNumber: order_number,
                productId: Number(product_id),
                targetQuantity: Number(target_quantity),
            },
        });

        res.status(201).json(order);
    } catch (err: any) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'Número da ordem já cadastrado' });
            return;
        }
        res.status(500).json({ error: 'Erro interno ao criar ordem' });
    }
});

router.get('/api/orders', async (_req: Request, res: Response) => {
    try {
        const orders = await prisma.productionOrder.findMany({
            include: { product: true, records: true },
            orderBy: { id: 'desc' },
        });

        const data = orders.map((order) => {
            const { totalGood, totalScrap } = calculateOrderProgress(order);
            return { ...order, totalGood, totalScrap };
        });

        res.json(data);
    } catch {
        res.status(500).json({ error: 'Erro interno ao listar ordens' });
    }
});

router.get('/api/orders/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const order = await prisma.productionOrder.findUnique({
            where: { id },
            include: {
                product: true,
                records: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!order) {
            res.status(404).json({ error: 'Ordem não encontrada' });
            return;
        }

        const { totalGood, totalScrap } = calculateOrderProgress(order);

        res.json({ ...order, totalGood, totalScrap });
    } catch {
        res.status(500).json({ error: 'Erro interno ao buscar ordem' });
    }
});

router.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body as { status?: string };

        if (!status || !['OPEN', 'IN_PROGRESS', 'FINISHED'].includes(status)) {
            res.status(400).json({ error: 'Status inválido. Use OPEN, IN_PROGRESS ou FINISHED' });
            return;
        }

        const updated = await prisma.productionOrder.update({
            where: { id },
            data: {
                status: status as 'OPEN' | 'IN_PROGRESS' | 'FINISHED',
                finishedAt: status === 'FINISHED' ? new Date() : null,
            },
        });

        res.json(updated);
    } catch (err: any) {
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Ordem não encontrada' });
            return;
        }
        res.status(500).json({ error: 'Erro interno ao atualizar status' });
    }
});

router.post('/api/orders/:id/records', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { type, quantity, note } = req.body as {
            type?: string;
            quantity?: number;
            note?: string;
        };

        if (!type || !['GOOD', 'SCRAP'].includes(type) || !quantity || quantity <= 0) {
            res.status(400).json({
                error: 'Tipo deve ser GOOD ou SCRAP e quantidade deve ser maior que zero',
            });
            return;
        }

        const order = await prisma.productionOrder.findUnique({
            where: { id },
            include: { records: true },
        });

        if (!order) {
            res.status(404).json({ error: 'Ordem não encontrada' });
            return;
        }

        if (order.status === 'FINISHED') {
            res.status(400).json({
                error: 'Não é possível registrar apontamentos em uma ordem finalizada',
            });
            return;
        }

        const { totalGood } = calculateOrderProgress(order);
        const qty = Number(quantity);

        if (type === 'GOOD' && totalGood + qty > order.targetQuantity) {
            res.status(400).json({
                error: 'A quantidade GOOD acumulada não pode ultrapassar a quantidade planejada',
            });
            return;
        }

        await prisma.productionRecord.create({
            data: {
                productionOrderId: order.id,
                type: type as 'GOOD' | 'SCRAP',
                quantity: qty,
                note: note ?? null,
            },
        });

        let newStatus: 'OPEN' | 'IN_PROGRESS' | 'FINISHED' = order.status;

        if (order.status === 'OPEN') {
            newStatus = 'IN_PROGRESS';
        }

        if (type === 'GOOD' && totalGood + qty === order.targetQuantity) {
            newStatus = 'FINISHED';
        }

        await prisma.productionOrder.update({
            where: { id: order.id },
            data: {
                status: newStatus,
                finishedAt: newStatus === 'FINISHED' ? new Date() : order.finishedAt,
            },
        });

        res.status(201).json({ ok: true });
    } catch {
        res.status(500).json({ error: 'Erro interno ao registrar apontamento' });
    }
});

router.get('/api/dashboard/production', async (_req: Request, res: Response) => {
    try {
        const [totalOrders, openOrders, finishedOrders, inProgressOrders, records] =
            await Promise.all([
                prisma.productionOrder.count(),
                prisma.productionOrder.count({ where: { status: 'OPEN' } }),
                prisma.productionOrder.count({ where: { status: 'FINISHED' } }),
                prisma.productionOrder.count({ where: { status: 'IN_PROGRESS' } }),
                prisma.productionRecord.findMany(),
            ]);

        const totalGood = records
            .filter((r) => r.type === 'GOOD')
            .reduce((sum, r) => sum + r.quantity, 0);

        const totalScrap = records
            .filter((r) => r.type === 'SCRAP')
            .reduce((sum, r) => sum + r.quantity, 0);

        res.json({ totalOrders, openOrders, finishedOrders, inProgressOrders, totalGood, totalScrap });
    } catch {
        res.status(500).json({ error: 'Erro interno ao carregar dashboard' });
    }
});

export default router;
