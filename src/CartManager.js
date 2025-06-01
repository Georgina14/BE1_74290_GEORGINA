import fs from "fs";

class CartManager{
  constructor(path){
    this.path = path;
  }

  generateNewId = (carts) => {
    if(carts.length > 0){
      return carts[carts.length - 1].id + 1;
    }else{
      return 1;
    }
  }

  async addCart (){
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);

      const id = this.generateNewId(carts);
      carts.push({ id, products: [] });

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8" );
      return carts;
    } catch (error) {
      throw new Error("Error, no se pudo agregar el carrito correctamente");
    }
  }

  async getProductsInCartById(cid){
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);

      const cart = carts.find((cartData)=> cartData.id == cid );
      return cart.products;
    } catch (error) {
      throw new Error("Error, no se pudo traer los productos del carrito correctamente");
    }
  }

  async addProductInCart(cid, pid, quantity){
    try {
      const cartJson = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartJson);

      carts.forEach(cart => {
        if(cart.id == cid){
          cart.products.push({ id: parseInt(pid), quantity });
        }
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      return carts;
    } catch (error) {
      throw new Error("Error, no se pudo agregar el producto en el carrito correctamente");
    }
  }
};

export default CartManager;