class ProductManager{
    #admin;
    
    constructor(){
    this.path = './src/products.json';
    this.#admin = true;
  }

async getProducts() {
    try{
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();

      this.products = data;
      } catch (error) {
                console.log("Hubo un error al traer los productos: ", error.message);
    }
  }


getProductById(productId) {
  try {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      console.log("Producto no encontrado");
      return null;
    }
    return product;
  } catch (error) {
    console.log("Hubo un error al buscar el producto: ", error.message);
  }
}

addProduct(newProduct){
    try {
      if(this.#admin){
        this.products.push(newProduct);
      }else{
        throw new Error("Permisos insuficientes");
      }
    } catch (error) {
      console.log("Hubo un error al agregar un producto: ", error.message);
    }
  }

updateProductById(productId, updatedFields) {
  try {
    if (!this.#admin) throw new Error("Permisos insuficientes");

    const index = this.products.findIndex(p => p.id === productId);
    if (index === -1) {
      console.log("Producto no encontrado");
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedFields };
  } catch (error) {
    console.log("Hubo un error al actualizar el producto: ", error.message);
  }
}

deleteProductById(productId){
    try {
      
      if(this.#admin){
        const newList = this.products.filter( (product) => product.id !== productId );
        this.products = newList;
      }else{
        throw new Error("Permisos insuficientes");
      }

    } catch (error) {
      console.log("Hubo un error al eliminar un producto: ", error.message);
    }
  }
};

const main = async () => {
  try {
    const productManager = new ProductManager();
    await productManager.getProducts();
    
    //Buscar producto
    const producto = productManager.getProductById(2);
    console.log("Producto con ID 2:", producto);
    
    //Actualizar producto
    productManager.updateProductById(2, { title: "Remera Gris", price: 20 });

    productManager.deleteProductById(20);
    productManager.addProduct({ id: 21, title: "Remera Rojo S" });

    console.log(productManager.products)
  } catch (error) {
    console.log(error.message);
  }
}

main();

