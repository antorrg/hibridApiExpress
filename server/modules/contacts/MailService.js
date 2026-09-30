import nodemailer from 'nodemailer'
import { throwError } from '../../errorHandler.js'
import env from '../../envConfig.js'



export class MailService {
    constructor(user, password){
        this.user = user
        this.password = password
        this.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
        user: this.user,
        pass: this.password,
    },
    tls: {
      rejectUnauthorized: false
    }
    })
    }

    sendEmail = async(email, subject, message) => {
        try{
        //Configuración del correo electrónico
        let mailOptions = {
            from: email,
            to: this.user,
            subject: subject,
            text: message,
            replyTo: email
        }
        await this.transporter.sendMail(mailOptions);
        return 'Mensaje enviado exitosamente'
        }catch(error){
            console.error('Error. Email no enviado', error)
            throwError('Error. Email no enviado', 500)
        }
    }
}

export const emailService = new MailService(env.GmailUser, env.GmailPass)