import express from 'express'
import ctr from './controllerService.js'
import midd from './userMiddlewares.js'
import dataUser from './createUserMidd.js'
import { verifyToken } from '../../utils/authConfig.js'
import { createLogLimiter } from '../../utils/rateLimits.js'

const logLimiter5 = createLogLimiter(5)
const logLimiter2 = createLogLimiter(2)

const restRouter = express.Router()

restRouter.post('/user/create',verifyToken,  dataUser, midd.loginUser, midd.validEmail, ctr.userCreate)

restRouter.get('/user',  verifyToken, ctr.userGetAll)

restRouter.get('/user/:id', verifyToken,  midd.validUUid, ctr.userGetById)

restRouter.put('/user/:id',  verifyToken, midd.validUUid, ctr.userUpdate)

restRouter.delete('/user/:id',  verifyToken, midd.validUUid, ctr.userDelete)

restRouter.post('/user/login', logLimiter5, midd.loginUser, midd.validEmail, midd.validPass, ctr.loginController)

restRouter.post('/user/logout', logLimiter2, ctr.logoutController);

export default restRouter;