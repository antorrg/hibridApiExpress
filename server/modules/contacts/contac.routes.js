import express from 'express'
import { postContact } from './controllerServices.js';
import { emailService } from './MailService.js';


const contactRouter = express.Router()

contactRouter.post("/contact", postContact(emailService.sendEmail))


export default contactRouter;