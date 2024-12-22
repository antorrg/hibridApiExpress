import express from 'express'
import ctr from '../Index&Controllers/index.js'
import { verifyToken } from '../authConfig.js'


const restRouter = express.Router()

restRouter.post('/user/login', ctr.loginController)

restRouter.post('/user/create', ctr.userRest.create)

restRouter.get('/user', verifyToken, ctr.userRest.getAll)

restRouter.post('/user/logout', ctr.logoutController)



export default restRouter;