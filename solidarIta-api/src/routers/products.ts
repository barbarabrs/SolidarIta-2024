import ProductsController from '../controllers/Products/ProductsController';

const path = '/products';
export function router(app: any) {
  app.post(`${path}`, async (request: any, response: any, next: any) => {
    const product = new ProductsController();

    try {
      const productData = await product.getProducts(request, response);
      response.json(productData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/add`, async (request: any, response: any, next: any) => {
    const product = new ProductsController();

    try {
      const productData = await product.AddProduct(request, response);
      response.json(productData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/delete`, async (request: any, response: any, next: any) => {
    const product = new ProductsController();

    try {
      const productData = await product.deleteProduct(request, response);
      response.json(productData);
    } catch (error: any) {
      next(error);
    }
  });

  app.post(`${path}/getProductsList`, async (request: any, response: any, next: any) => {
    const product = new ProductsController();

    try {
      const productData = await product.getOneProductsList(request, response);
      response.json(productData);
    } catch (error: any) {
      next(error);
    }
  });
}
