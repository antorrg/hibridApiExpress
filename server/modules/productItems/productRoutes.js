import express from 'express'
import ctr from './controllerService.js'
import value from './productMiddlewares.js'
import { checkRole} from '../../utils/authConfig.js'
import { addFields } from './productFunctions.js'
import MiddlewareHandler from '../../middlewares/MiddlewareHandler.js'

const productRouter = express.Router()

productRouter.post('/product/create', 
     MiddlewareHandler.validateFieldsWithItems(value.createProd, value.secondField, 'items'), 
     addFields, 
     ctr.createProduct);

productRouter.get('/product',  
    ctr.getProduct);

productRouter.get('/product/:id',  
    MiddlewareHandler.middIntId, 
    ctr.getProductById);

productRouter.put('/product/:id',  
    MiddlewareHandler.middIntId, 
    MiddlewareHandler.validateFields(value.updateProd), 
    ctr.updateProduct);

productRouter.delete('/product/:id',  
    MiddlewareHandler.middIntId, 
    ctr.deleteProduct)

//Rutas de item:
productRouter.post('/item/create',  
    MiddlewareHandler.validateFields(value.createItem), 
    ctr.createItem);

productRouter.get('/item/:id', 
    MiddlewareHandler.middIntId,   
    ctr.getItem);

productRouter.put('/item/:id',  
    MiddlewareHandler.middIntId,  
    MiddlewareHandler.validateFields(value.updateItem), 
    ctr.updateItem);

productRouter.delete('/item/:id',  
    MiddlewareHandler.middIntId, 
    ctr.deleteItem);


export default productRouter;