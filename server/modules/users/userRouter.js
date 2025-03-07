import express from 'express'
import ctr from './controllerService.js'
import value from "./userMiddlewares.js"
import MiddlewareHandler from '../../middlewares/MiddlewareHandler.js'
import { dataUser, upgradeUserParser, profileUserAccess, profileParserInfo, verifyOwnerActionsInBody, verifyOwnerActionsInParam, hasheredPass, resetPassParser } from './userFunctions.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
import { createLogLimiter } from '../../utils/rateLimits.js'

const logLimiter5 = createLogLimiter(5)
const logLimiter2 = createLogLimiter(2)

const restRouter = express.Router()

restRouter.post('/user/create', 
    verifyToken,  
    MiddlewareHandler.validateFields(value.createUser), 
    MiddlewareHandler.validateRegex(value.email, 'email'),
    dataUser, 
    ctr.userCreate)

restRouter.get('/user',  
    verifyToken, 
    ctr.userGetAll)

restRouter.get('/user/:id', 
    verifyToken,  
    MiddlewareHandler.middUuid, 
    ctr.userGetById)

restRouter.put('/user/profile/:id',  
    verifyToken, 
    MiddlewareHandler.middUuid, 
    profileUserAccess, 
    MiddlewareHandler.validateFields(value.updateUser), 
    profileParserInfo,  
    ctr.userUpdate)

restRouter.post('/user/verify', 
    verifyToken, 
    verifyOwnerActionsInBody, 
    MiddlewareHandler.validateRegex(value.password, 'password', 'It must be at least 8 characters long and one uppercase letter'), 
    ctr.verifyPass)

restRouter.put('/user/update/:id', 
    verifyToken, 
    MiddlewareHandler.middUuid, 
    verifyOwnerActionsInParam,  
    MiddlewareHandler.validateRegex(value.password, 'password', 'It must be at least 8 characters long and one uppercase letter'), 
    hasheredPass, 
    ctr.userUpdatePass)

restRouter.put('/user/upgrade/:id', 
    verifyToken,  
    checkRole([9]), 
    MiddlewareHandler.middUuid, 
    MiddlewareHandler.validateFields(value.upgradeUser),  
    upgradeUserParser, 
    ctr.userUpgrade)

restRouter.put('/user/reset/:id', 
    verifyToken,   
    checkRole([9]), 
    MiddlewareHandler.middUuid,  
    resetPassParser, 
    ctr.userResetPass)

restRouter.delete('/user/:id',  
    verifyToken, 
    checkRole([9]), 
    MiddlewareHandler.middUuid, 
    ctr.userDelete)

restRouter.post('/user/login', 
    logLimiter5, 
    MiddlewareHandler.validateFields(value.loginUser),  
    MiddlewareHandler.validateRegex(value.email, 'email'),
    MiddlewareHandler.validateRegex(value.password, 'password', 'It must be at least 8 characters long and one uppercase letter'), 
    ctr.loginController)

restRouter.post('/user/logout', 
    logLimiter2, 
    ctr.logoutController);

export default restRouter;