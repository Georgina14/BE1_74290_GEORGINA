import { Router } from 'express';

const router = Router();

let products = [];

router.get('/', (req, res) => {
  res.render('home', { title: 'Home', products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

export default router;
