import express from 'express'
import controller from './MvcControllers.js'
import mdd from '../../middlewares/middlewares.js'

const mvcRouter = express.Router()

mvcRouter.get('/', controller.getLanding)

mvcRouter.get('/about', controller.getAbout);

mvcRouter.get('/form', controller.getReact);

mvcRouter.post('/api', mdd.validCreateProduct, controller.probarMiddlewares)

mvcRouter.post('/land', mdd.validateEmail, controller.probarMiddlewares)

export default mvcRouter;