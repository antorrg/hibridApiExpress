import express from 'express'
import postContact from './controllerServices.js';

const contactRouter = express.Router()

contactRouter.post("/contact", postContact)


export default contactRouter;