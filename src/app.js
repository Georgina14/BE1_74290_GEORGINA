import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import { engine } from 'express-handlebars';

import CartManager from './CartManager.js';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const cartManager = new CartManager('./src/carts.json');
const productManager = new ProductManager('./src/products.json');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', async (req, res) => {
  const product = await productManager.addProduct(req.body);
  io.emit('productList', await productManager.getProducts()); 
  res.status(201).json(product);
});

app.put('/api/products/:pid', async (req, res) => {
  const updated = await productManager.updateProductById(req.params.pid, req.body);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  const deleted = await productManager.deleteProductById(req.params.pid);
  io.emit('productList', await productManager.getProducts());
  res.sendStatus(deleted ? 204 : 404);
});

app.post('/api/carts', async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    res.status(201).json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


app.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Home', products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});


io.on('connection', async socket => {
  console.log('🔌 Cliente conectado');
  const products = await productManager.getProducts();
  socket.emit('productList', products);

  socket.on('addProduct', async product => {
    await productManager.addProduct(product);
    const updated = await productManager.getProducts();
    io.emit('productList', updated);
  });

  socket.on('deleteProduct', async id => {
    await productManager.deleteProductById(id);
    const updated = await productManager.getProducts();
    io.emit('productList', updated);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
