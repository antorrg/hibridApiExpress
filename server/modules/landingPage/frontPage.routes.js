import express from 'express'
import ctr from './landControllerService.js'
import value from './landMiddleware.js'
import MiddlewareHandler from '../../middlewares/MiddlewareHandler.js'



const landRouter = express.Router()

landRouter.post('/land/create',  
    MiddlewareHandler.validateFields(value.createLand), 
    ctr.landCreate)

landRouter.get('/land',  
    ctr.landGetAll)

landRouter.put('/land/:id', 
    MiddlewareHandler.middIntId('id'), 
    MiddlewareHandler.validateFields(value.updateLand), 
     ctr.landUpdate)

export default landRouter;