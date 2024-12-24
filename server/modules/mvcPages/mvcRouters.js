import express from 'express'
import controller from './MvcControllers.js'


const mvcRouter = express.Router()

mvcRouter.get('/', controller.getLanding)

mvcRouter.get('/products', controller.getProduct)

mvcRouter.get('/product/:id', controller.getDetails)

mvcRouter.get('/product/item/:id', controller.getItems)

mvcRouter.post('/contact',)

mvcRouter.get('/about', controller.getAbout);

mvcRouter.get('/form', controller.getReact);


export default mvcRouter;