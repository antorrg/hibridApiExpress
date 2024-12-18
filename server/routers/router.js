import express from 'express'
import mvcRouter from './mvcRouters.js';
import restRouter from './restRouters.js';

const mainRouter = express.Router()

mainRouter.use(mvcRouter)

mainRouter.use('/api/v4', restRouter)


export default mainRouter; 
