import express from 'express'
import ctr from './controllerService.js'
import midd from './userMiddlewares.js'
import { dataUser, upgradeUserParser, profileUserAccess, profileParserInfo, verifyOwnerActionsInBody, verifyOwnerActionsInParam, hasheredPass, resetPassParser } from './userFunctions.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
import { createLogLimiter } from '../../utils/rateLimits.js'

const logLimiter5 = createLogLimiter(5)
const logLimiter2 = createLogLimiter(2)

const restRouter = express.Router()

restRouter.post('/user/create', verifyToken,  midd.validCreateUser, midd.validEmail, dataUser, ctr.userCreate)

restRouter.get('/user',  verifyToken, ctr.userGetAll)

restRouter.get('/user/:id', verifyToken,  midd.validUUid, ctr.userGetById)

restRouter.put('/user/profile/:id',  verifyToken, midd.validUUid, profileUserAccess, midd.updateUser, profileParserInfo,  ctr.userUpdate)

restRouter.post('/user/verify', verifyToken, verifyOwnerActionsInBody, midd.validatePassword, ctr.verifyPass)

restRouter.put('/user/update/:id', verifyToken, verifyOwnerActionsInParam,  midd.validPass, hasheredPass, ctr.userUpdatePass)

restRouter.put('/user/upgrade/:id', verifyToken,  checkRole([9]), midd.upgradeUser, upgradeUserParser, ctr.userUpgrade)

restRouter.put('/user/reset/:id', verifyToken,   checkRole([9]), resetPassParser, ctr.userResetPass)

restRouter.delete('/user/:id',  verifyToken, checkRole([9]), midd.validUUid, ctr.userDelete)

restRouter.post('/user/login', logLimiter5, midd.loginUser, midd.validEmail, midd.validPass, ctr.loginController)

restRouter.post('/user/logout', logLimiter2, ctr.logoutController);

export default restRouter;