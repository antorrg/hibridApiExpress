import express from 'express'
import controller from './MvcControllers.js'


const mvcRouter = express.Router()

mvcRouter.get('/', controller.getLanding)

mvcRouter.get('/detalles', controller.getProduct)

mvcRouter.get('/detalle/:id', controller.getDetails)

mvcRouter.get('/detalle/item/:id', controller.getItems)

mvcRouter.post('/contacto',)

mvcRouter.get('/acerca', controller.getAbout);

mvcRouter.get('/form', controller.getReact);

// mvcRouter.get('*', (req, res, next)=>{
//         // res.status(404).send('Not Found')
//          res.render('error', { message: 'Not Found', status: 404});
//        });


export default mvcRouter;