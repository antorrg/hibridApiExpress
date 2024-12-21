import express from 'express'
import mvcRouter from './mvcRouters.js';
import restRouter from './restRouters.js';
import * as img from '../Index&Controllers/uploaderImgs.js'

const mainRouter = express.Router()

mainRouter.post('/api/v4/uploadImg', img.uploadMiddleware, img.imageUploader )


mainRouter.use(mvcRouter)

mainRouter.use('/api/v4', restRouter)


export default mainRouter; 
