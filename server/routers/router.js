import express from 'express'
import * as img from '../Index&Controllers/uploaderImgs.js'
import mvcRouter from '../modules/mvcPages/mvcRouters.js';
import landRouter from '../modules/landingPage/landRouter.js'
import userRouter from '../modules/users/userRouter.js'

const mainRouter = express.Router()

mainRouter.post('/api/v4/uploadImg', img.uploadMiddleware, img.imageUploader )


mainRouter.use(mvcRouter)

mainRouter.use('/api/v4', userRouter)

mainRouter.use('/api/v4', landRouter)


export default mainRouter; 
