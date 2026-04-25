import express from 'express';
import { pool } from './db.js';

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

        const result = await pool.query(
            'INSERT INTO products (name, sku) VALUES ($1, $2) RETURNING *',
            [name, sku]
        );

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'SKU já existe' });
        }

        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.get('/products', async (req, res) => {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
});

//
// 🔹 ORDENS
//
router.post('/orders', async (req, res) => {
    const { order_number, product_id, target_quantity } = req.body;

    if (!order_number || !product_id || target_quantity <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO production_orders 
       (order_number, product_id, target_quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [order_number, product_id, target_quantity]
        );

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Número da ordem já existe' });
        }

        res.status(500).json({ error: 'Erro ao criar ordem' });
    }
});

router.get('/orders', async (req, res) => {
    const result = await pool.query(`
    SELECT 
      o.id,
      o.order_number,
      o.target_quantity,
      o.status,
      p.name AS product_name,
      COALESCE(SUM(CASE WHEN r.type = 'GOOD' THEN r.quantity END), 0) AS total_good,
      COALESCE(SUM(CASE WHEN r.type = 'SCRAP' THEN r.quantity END), 0) AS total_scrap
    FROM production_orders o
    JOIN products p ON p.id = o.product_id
    LEFT JOIN production_records r ON r.production_order_id = o.id
    GROUP BY o.id, p.name
    ORDER BY o.id DESC
  `);

    const data = result.rows.map((row) => {
        const progress = (row.total_good / row.target_quantity) * 100;

        return {
            ...row,
            progress: progress.toFixed(2)
        };
    });

    res.json(data);
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

    const orderResult = await pool.query(
        'SELECT * FROM production_orders WHERE id = $1',
        [id]
    );

    if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    const order = orderResult.rows[0];

    if (order.status === 'FINISHED') {
        return res.status(400).json({ error: 'Ordem finalizada' });
    }

    const sumResult = await pool.query(
        `
    SELECT COALESCE(SUM(quantity), 0) AS total
    FROM production_records
    WHERE production_order_id = $1 AND type = 'GOOD'
    `,
        [id]
    );

    const totalGood = Number(sumResult.rows[0].total);

    if (type === 'GOOD' && totalGood + quantity > order.target_quantity) {
        return res.status(400).json({ error: 'Ultrapassa quantidade da ordem' });
    }

    await pool.query(
        `INSERT INTO production_records 
     (production_order_id, type, quantity, note)
     VALUES ($1, $2, $3, $4)`,
        [id, type, quantity, note]
    );

    let newStatus = order.status;

    if (order.status === 'OPEN') {
        newStatus = 'IN_PROGRESS';
    }

    if (type === 'GOOD' && totalGood + quantity === order.target_quantity) {
        newStatus = 'FINISHED';
    }

    await pool.query(
        `UPDATE production_orders 
     SET status = $1,
         finished_at = CASE WHEN $1 = 'FINISHED' THEN NOW() ELSE finished_at END
     WHERE id = $2`,
        [newStatus, id]
    );

    res.json({ ok: true });
});

//
// 🔹 SUMMARY / PROGRESS
//
router.get('/orders/:id/summary', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'GOOD' THEN quantity END), 0) AS total_good,
      COALESCE(SUM(CASE WHEN type = 'SCRAP' THEN quantity END), 0) AS total_scrap
    FROM production_records
    WHERE production_order_id = $1
    `,
        [id]
    );

    res.json(result.rows[0]);
});

router.get('/orders/:id/progress', async (req, res) => {
    const { id } = req.params;

    const order = await pool.query(
        'SELECT target_quantity FROM production_orders WHERE id = $1',
        [id]
    );

    if (order.rows.length === 0) {
        return res.status(404).json({ error: 'Ordem não encontrada' });
    }

    const summary = await pool.query(
        `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'GOOD' THEN quantity END), 0) AS total_good
    FROM production_records
    WHERE production_order_id = $1
    `,
        [id]
    );

    const totalGood = Number(summary.rows[0].total_good);
    const target = order.rows[0].target_quantity;

    const progress = (totalGood / target) * 100;

    res.json({
        totalGood,
        target,
        progress: progress.toFixed(2)
    });
});

//
// 🔹 DASHBOARD
//
router.get('/dashboard/production', async (req, res) => {
    const result = await pool.query(`
    SELECT 
      COUNT(*) AS total_orders,
      COUNT(*) FILTER (WHERE status = 'OPEN') AS open_orders,
      COUNT(*) FILTER (WHERE status = 'FINISHED') AS finished_orders
    FROM production_orders
  `);

    const records = await pool.query(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'GOOD' THEN quantity END), 0) AS total_good,
      COALESCE(SUM(CASE WHEN type = 'SCRAP' THEN quantity END), 0) AS total_scrap
    FROM production_records
  `);

    res.json({
        ...result.rows[0],
        ...records.rows[0]
    });
});

//
// 🔹 EXPORT (SEMPRE NO FINAL)
//
export default router;