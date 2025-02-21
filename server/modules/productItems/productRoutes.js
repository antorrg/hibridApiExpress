import express from 'express'
import ctr from './controllerService.js'
import midd from './productMiddlewares.js'
import { checkRole} from '../../utils/authConfig.js'
import { addFields } from './productFunctions.js'

const productRouter = express.Router()

productRouter.post('/product/create',  midd.createProd, addFields, ctr.createProduct);

productRouter.get('/product',  ctr.getProduct);

productRouter.get('/product/:id',  midd.validId, ctr.getProductById);

productRouter.put('/product/:id',  midd.validId, midd.updateProd, ctr.updateProduct);

productRouter.delete('/product/:id',  midd.validId, ctr.deleteProduct)

//Rutas de item:
productRouter.post('/item/create',  midd.createItem, ctr.createItem);

productRouter.get('/item/:id', midd.validId,  ctr.getItem);

productRouter.put('/item/:id',  midd.validId, midd.updateItem ,ctr.updateItem);

productRouter.delete('/item/:id',  midd.validId, ctr.deleteItem);


export default productRouter;