import express from 'express'
import ctr from './landControllerService.js'
import midd from './landMiddleware.js'



const landRouter = express.Router()

landRouter.post('/land/create',  midd.createLand, ctr.landCreate)

landRouter.get('/land',  ctr.landGetAll)

landRouter.put('/land/:id',  midd.validId, midd.updateLand, ctr.landUpdate)

export default landRouter;