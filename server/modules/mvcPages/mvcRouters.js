import express from 'express'
import controller from './MvcControllers.js'
import midd from '../productItems/productMiddlewares.js'
import MiddlewareHandler from '../../middlewares/MiddlewareHandler.js'

const mvcRouter = express.Router()

mvcRouter.get('/', 
  controller.getLanding)

mvcRouter.get('/detalles', 
  controller.getProduct)

mvcRouter.get('/detalles/:id',  
  MiddlewareHandler.middIntId, 
  controller.getDetails)

mvcRouter.get('/detalles/item/:id', 
  MiddlewareHandler.middIntId, 
  controller.getItems)

mvcRouter.get('/contacto', 
  controller.getContact)

mvcRouter.get('/acerca', 
  controller.getAbout);

mvcRouter.get('/login', 
  controller.getReact);

mvcRouter.get('/admin', 
  controller.getReact);

mvcRouter.get('/detalles/false', (req, res, next)=>{
        // res.status(404).send('Not Found')
         res.render('error', { message: 'Not Found', status: 404});
       });


export default mvcRouter;