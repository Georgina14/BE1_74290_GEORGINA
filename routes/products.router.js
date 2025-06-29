import { Router } from 'express';
const router = Router();

let products = [];

router.get('/', (req, res) => {
  res.json(products);
});

router.post('/', (req, res) => {
  const { title, price } = req.body;
  const newProduct = { id: Date.now(), title, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id != id);
  res.sendStatus(204);
});

export default router;
