import express from 'express'
import controller from '../Index&Controllers/mvcControlllers.js'

const mvcRouter = express.Router()

mvcRouter.get('/', controller.getLanding)

mvcRouter.get('/about', controller.getAbout);

mvcRouter.get('/form', controller.getReact);

export default mvcRouter;