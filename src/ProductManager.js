import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id = Date.now();
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProductById(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProductById(id) {
    let products = await this.getProducts();
    const filtered = products.filter(p => p.id != id);
    const deleted = filtered.length < products.length;
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return deleted;
  }
}
