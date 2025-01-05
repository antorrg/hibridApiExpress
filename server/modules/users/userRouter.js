import express from 'express'
import ctr from './controllerService.js'
import midd from './userMiddlewares.js'
import { dataUser, upgradeUserParser, profileUserAccess, profileParserInfo, verifyOwnerActions, resetPassParser } from './userFunctions.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
import { createLogLimiter } from '../../utils/rateLimits.js'

const logLimiter5 = createLogLimiter(5)
const logLimiter2 = createLogLimiter(2)

const restRouter = express.Router()

restRouter.post('/user/create', verifyToken,  midd.validCreateUser, midd.validEmail, dataUser, ctr.userCreate)

restRouter.get('/user',  verifyToken, ctr.userGetAll)

restRouter.get('/user/:id', verifyToken,  midd.validUUid, ctr.userGetById)

restRouter.put('/user/profile/:id',  verifyToken, midd.validUUid, profileUserAccess, midd.updateUser, profileParserInfo,  ctr.userUpdate)

restRouter.post('/user/verify', verifyToken, verifyOwnerActions, midd.validatePassword, ctr.verifyPass)

restRouter.put('/user/update/:id', verifyToken, verifyOwnerActions, midd.validPass, ctr.userUpdatePass)

restRouter.put('/user/upgrade', verifyToken,  checkRole([9]), midd.upgradeUser, upgradeUserParser, ctr.userUpgrade)

restRouter.put('/user/reset', verifyToken, checkRole([9]), midd.resetPassword, resetPassParser, ctr.userResetPass)

restRouter.delete('/user/:id',  verifyToken, checkRole([9]), midd.validUUid, ctr.userDelete)

restRouter.post('/user/login', logLimiter5, midd.loginUser, midd.validEmail, midd.validPass, ctr.loginController)

restRouter.post('/user/logout', logLimiter2, ctr.logoutController);

export default restRouter;