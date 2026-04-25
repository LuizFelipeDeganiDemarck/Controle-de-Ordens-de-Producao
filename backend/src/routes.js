import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

//
// 🔹 TESTE
//
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

//
// 🔹 PRODUTOS
//
router.post('/products', async (req, res) => {
    try {
        const { name, sku } = req.body;

        if (!name || !sku) {
            return res.status(400).json({ error: 'Dados obrigatórios' });
        }

        const result = await prisma.product.create({
            data: { name, sku },
        });

        res.json(result);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'SKU já existe' });
        }
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.get('/products', async (req, res) => {
    const result = await prisma.product.findMany({
        orderBy: { id: 'desc' },
    });
    res.json(result);
});

//
// 🔹 ORDENS
//
router.post('/orders', async (req, res) => {
    try {
        const { order_number, product_id, target_quantity } = req.body;

        if (!order_number || !product_id || target_quantity <= 0) {
            return res.status(400).json({ error: 'Dados inválidos' });
        }

        const result = await prisma.productionOrder.create({
            data: {
                orderNumber: order_number,
                productId: Number(product_id),
                targetQuantity: Number(target_quantity),
            },
        });

        res.json(result);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Número da ordem já existe' });
        }
        res.status(500).json({ error: 'Erro ao criar ordem' });
    }
});

//
// 🔹 LISTAR ORDENS (com progresso)
//
router.get('/orders', async (req, res) => {
    const orders = await prisma.productionOrder.findMany({
        include: {
            product: true,
            records: true,
        },
        orderBy: { id: 'desc' },
    });

    const data = orders.map((order) => {
        const totalGood = order.records
            .filter(r => r.type === 'GOOD')
            .reduce((sum, r) => sum + r.quantity, 0);

        const totalScrap = order.records
            .filter(r => r.type === 'SCRAP')
            .reduce((sum, r) => sum + r.quantity, 0);

        const progress = (totalGood / order.targetQuantity) * 100;

        return {
            ...order,
            totalGood,
            totalScrap,
            progress: progress.toFixed(2),
        };
    });

    res.json(data);
});

//
// 🔹 DETALHE DA ORDEM
//
router.get('/orders/:id', async (req, res) => {
    const { id } = req.params;

    const order = await prisma.productionOrder.findUnique({
        where: { id: Number(id) },
        include: {
            product: true,
            records: true,
        },
    });

    if (!order) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    const totalGood = order.records
        .filter(r => r.type === 'GOOD')
        .reduce((sum, r) => sum + r.quantity, 0);

    const totalScrap = order.records
        .filter(r => r.type === 'SCRAP')
        .reduce((sum, r) => sum + r.quantity, 0);

    const progress = (totalGood / order.targetQuantity) * 100;

    res.json({
        ...order,
        totalGood,
        totalScrap,
        progress: progress.toFixed(2),
    });
});

//
// 🔹 ATUALIZAR STATUS
//
router.patch('/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['OPEN', 'IN_PROGRESS', 'FINISHED'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    const updated = await prisma.productionOrder.update({
        where: { id: Number(id) },
        data: {
            status,
            finishedAt: status === 'FINISHED' ? new Date() : null,
        },
    });

    res.json(updated);
});

//
// 🔹 APONTAMENTOS
//
router.post('/orders/:id/records', async (req, res) => {
    const { id } = req.params;
    const { type, quantity, note } = req.body;

    if (!['GOOD', 'SCRAP'].includes(type) || quantity <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    const order = await prisma.productionOrder.findUnique({
        where: { id: Number(id) },
        include: { records: true },
    });

    if (!order) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    if (order.status === 'FINISHED') {
        return res.status(400).json({ error: 'Ordem finalizada' });
    }

    const totalGood = order.records
        .filter(r => r.type === 'GOOD')
        .reduce((sum, r) => sum + r.quantity, 0);

    if (type === 'GOOD' && totalGood + quantity > order.targetQuantity) {
        return res.status(400).json({ error: 'Ultrapassa quantidade da ordem' });
    }

    await prisma.productionRecord.create({
        data: {
            productionOrderId: order.id,
            type,
            quantity,
            note,
        },
    });

    let newStatus = order.status;

    if (order.status === 'OPEN') {
        newStatus = 'IN_PROGRESS';
    }

    if (type === 'GOOD' && totalGood + quantity === order.targetQuantity) {
        newStatus = 'FINISHED';
    }

    await prisma.productionOrder.update({
        where: { id: order.id },
        data: {
            status: newStatus,
            finishedAt: newStatus === 'FINISHED' ? new Date() : order.finishedAt,
        },
    });

    res.json({ ok: true });
});

//
// 🔹 DASHBOARD
//
router.get('/dashboard/production', async (req, res) => {
    const totalOrders = await prisma.productionOrder.count();

    const openOrders = await prisma.productionOrder.count({
        where: { status: 'OPEN' },
    });

    const finishedOrders = await prisma.productionOrder.count({
        where: { status: 'FINISHED' },
    });

    const records = await prisma.productionRecord.findMany();

    const totalGood = records
        .filter(r => r.type === 'GOOD')
        .reduce((sum, r) => sum + r.quantity, 0);

    const totalScrap = records
        .filter(r => r.type === 'SCRAP')
        .reduce((sum, r) => sum + r.quantity, 0);

    res.json({
        totalOrders,
        openOrders,
        finishedOrders,
        totalGood,
        totalScrap,
    });
});

export default router;