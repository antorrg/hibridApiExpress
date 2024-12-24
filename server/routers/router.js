import express from 'express'
import * as img from '../utils/uploaderImgs.js'
import mvcRouter from '../modules/mvcPages/mvcRouters.js';
import landRouter from '../modules/landingPage/landRouter.js'
import productRouter from '../modules/productItems/productRoutes.js'
import userRouter from '../modules/users/userRouter.js'
import sanit from '../utils/expressValidator.js'
import {verifyToken} from '../utils/authConfig.js'

const mainRouter = express.Router()

mainRouter.use(sanit.sanitizeHeaders)
mainRouter.use(sanit.sanitizeBody)
mainRouter.use(sanit.sanitizeQuery)

mainRouter.use(mvcRouter)

mainRouter.post('/api/v1/uploadImg', verifyToken, img.uploadMiddleware, img.imageUploader )

mainRouter.use('/api/v1', verifyToken, landRouter)

mainRouter.use('api/v1', verifyToken, productRouter)

mainRouter.use('/api/v1', userRouter)


export default mainRouter; 
