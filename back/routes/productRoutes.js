import {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

export default function productRoutes(app) {
    app.get('/products', getProducts);
    app.get('/products/:id', getProduct);
    
    app.post('/products', createProduct);
    app.patch('/products/:id', updateProduct);
    app.delete('/products/:id', deleteProduct);
}
