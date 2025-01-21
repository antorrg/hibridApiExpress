import express from 'express'
import ctr from './controllerService.js'
import midd from './userMiddlewares.js'
import { dataUser, upgradeUserParser, profileUserAccess, profileParserInfo, verifyOwnerActionsInBody, verifyOwnerActionsInParam, hasheredPass, resetPassParser } from './userFunctions.js'
import { verifyToken, checkRole} from '../../utils/authConfig.js'
import { createLogLimiter } from '../../utils/rateLimits.js'

const logLimiter5 = createLogLimiter(5)
const logLimiter2 = createLogLimiter(2)

const restRouter = express.Router()
/**
 * @route POST /user/create
 * @description Create a new user
 * @access Private
 * @middleware verifyToken, validCreateUser, validEmail, dataUser
 */

restRouter.post('/user/create', verifyToken,  midd.validCreateUser, midd.validEmail, dataUser, ctr.userCreate)
/**
 * @route GET /user
 * @description Get one array with users
 * @access Private
 * @middleware verifyToken
 */
restRouter.get('/user',  verifyToken, ctr.userGetAll)
/**
 * @route GET /user/:id
 * @description Get a user by ID
 * @access Private
 * @middleware verifyToken, validUUid
 */
restRouter.get('/user/:id', verifyToken,  midd.validUUid, ctr.userGetById)
/**
 * @route PUT /user/profile/:id
 * @description Update the profile of a user
 * @access Private
 * @middleware verifyToken, validUUid, profileUserAccess, updateUser, profileParserInfo
 */
restRouter.put('/user/profile/:id',  verifyToken, midd.validUUid, profileUserAccess, midd.updateUser, profileParserInfo,  ctr.userUpdate)
/**
 * @route POST /user/verify
 * @description Verify user password
 * @access Private
 * @middleware verifyToken, verifyOwnerActionsInBody, validatePassword
 */
restRouter.post('/user/verify', verifyToken, verifyOwnerActionsInBody, midd.validatePassword, ctr.verifyPass)
/**
 * @route PUT /user/update/:id
 * @description Update user password
 * @access Private
 * @middleware verifyToken, verifyOwnerActionsInParam, validPass, hasheredPass
 */
restRouter.put('/user/update/:id', verifyToken, verifyOwnerActionsInParam,  midd.validPass, hasheredPass, ctr.userUpdatePass)
/**
 * @route PUT /user/upgrade/:id
 * @description Upgrade user role
 * @access Private (Requires Role 9)
 * @middleware verifyToken, checkRole, upgradeUser, upgradeUserParser
 */
restRouter.put('/user/upgrade/:id', verifyToken,  checkRole([9]), midd.upgradeUser, upgradeUserParser, ctr.userUpgrade)
/**
 * @route PUT /user/reset/:id
 * @description Reset user password
 * @access Private (Requires Role 9)
 * @middleware verifyToken, checkRole, resetPassParser
 */
restRouter.put('/user/reset/:id', verifyToken,   checkRole([9]), resetPassParser, ctr.userResetPass)
/**
 * @route DELETE /user/:id
 * @description Delete a user
 * @access Private (Requires Role 9)
 * @middleware verifyToken, checkRole, validUUid
 */
restRouter.delete('/user/:id',  verifyToken, checkRole([9]), midd.validUUid, ctr.userDelete)
/**
 * @route POST /user/login
 * @description Log in a user
 * @access Public (Limited to 5 attempts)
 * @middleware loginUser, validEmail, validPass
 */
restRouter.post('/user/login', logLimiter5, midd.loginUser, midd.validEmail, midd.validPass, ctr.loginController)
/**
 * @route POST /user/logout
 * @description Log out a user
 * @access Private (Limited to 2 attempts)
 */
restRouter.post('/user/logout', logLimiter2, ctr.logoutController);

export default restRouter;