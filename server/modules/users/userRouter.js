import express from 'express'
import ctr from './controllerService.js'
import value from "./userMiddlewares.js"
import MiddlewareHandler from '../../middlewares/MiddlewareHandler.js'
import { dataUser, upgradeUserParser, profileUserAccess, profileParserInfo, verifyOwnerActionsInBody, verifyOwnerActionsInParam, hasheredPass, resetPassParser } from './userFunctions.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
//import { createLogLimiter } from '../../utils/rateLimits.js'

//const logLimiter5 = createLogLimiter(5)
//const logLimiter2 = createLogLimiter(2)

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
    MiddlewareHandler.middUuid('id'), 
    ctr.userGetById)

restRouter.put('/user/profile/:id',  
    verifyToken, 
    MiddlewareHandler.middUuid('id'), 
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
    MiddlewareHandler.middUuid('id'), 
    verifyOwnerActionsInParam,  
    MiddlewareHandler.validateRegex(value.password, 'password', 'It must be at least 8 characters long and one uppercase letter'), 
    hasheredPass, 
    ctr.userUpdatePass)

restRouter.put('/user/upgrade/:id', 
    verifyToken,  
    checkRole([9]), 
    MiddlewareHandler.middUuid('id'), 
    MiddlewareHandler.validateFields(value.upgradeUser),  
    upgradeUserParser, 
    ctr.userUpgrade)

restRouter.put('/user/reset/:id', 
    verifyToken,   
    checkRole([9]), 
    MiddlewareHandler.middUuid('id'),  
    resetPassParser, 
    ctr.userResetPass)

restRouter.delete('/user/:id',  
    verifyToken, 
    checkRole([9]), 
    MiddlewareHandler.middUuid('id'), 
    ctr.userDelete)

restRouter.post('/user/login', 
    MiddlewareHandler.validateFields(value.loginUser),  
    MiddlewareHandler.validateRegex(value.email, 'email'),
    MiddlewareHandler.validateRegex(value.password, 'password', 'It must be at least 8 characters long and one uppercase letter'), 
    ctr.loginController)

restRouter.post('/user/logout', 
    ctr.logoutController);

export default restRouter;
