import nodemailer from 'nodemailer'
import env from '../../envConfig.js'
import { catchController } from '../../errorHandler.js';



const  postContact = catchController(async (req, res)=>{
  const { email, subject, message } = req.body;
  //console.log(req.body);
  //este console.log de arriba me da que la info es correcta: email es el remitente, 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
        user: env.GmailUser,
        pass: env.GmailPass,
    },
    tls: {
      rejectUnauthorized: false
  }
});

//Configuración del correo electrónico
let mailOptions = {
    from: email,
    to: env.GmailUser,
    subject: subject,
    text: message,
    replyTo: email
};
  try {
      //console.log({mailOptions})
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        success:true,
        message: 'Mensaje enviado exitosamente',
        results: null
        })
  } catch (error) {
      throw error;
  }
});
export default postContact