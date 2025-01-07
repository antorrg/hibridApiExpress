/* istanbul ignore file */
import express from 'express'
import cookieParser from 'cookie-parser';
import {catchController} from '../../server/errorHandler.js'
import clean from '../../server/helpers/generalHelp.js'
import {sessionMiddle, generateToken, verifyToken} from '../../server/utils/authConfig.js'

const mockUserLogin = (email, password, role)=>{
    return {id: "c1d970cf-9bb6-4848-aa76-191f905a2edd",
            email: email,
            password: password,
            role: role
             }
}

const authServer = express()
authServer.use(cookieParser())
authServer.use(sessionMiddle)
authServer.use(express.json())

  //controllers funcionales para el inicio y fin de sesion.
authServer.post('/test/auth/login', catchController(async (req, res) => {
    const { email, password, role } = req.body;
    const response =  mockUserLogin(email, password, role);
    const token = generateToken(response, req.session);
    req.session.user = {
      userId: response.id,
      email: response.email,
      role: response.role,
      token,
    };
    req.session.isAuthenticated = true;

    // Configurar la cookie de sesión
    res.cookie("sessionId", req.session.user.userId, {
      httpOnly: true, // Solo accesible por el servidor
      secure: false, // Cambiar a true si usas HTTPS
      sameSite: "None", // Evitar CSRF
      maxAge: 1000 * 60 * 60, // 1 hora
    });
    //console.log('soy la sesion iniciada: ',req.session.user)
    const userResponse = clean.userParser(response, true)
    res.status(200).json({ user: userResponse, token });
    
  })),

  authServer.get('/test/auth', verifyToken, catchController(async(req, res) => {
    console.log('Soy la sesion: ',req.session)
    res.status(200).json({ message: 'Passed middleware' })}))

authServer.get('/test/auth/response', verifyToken, catchController(async(req, res) => {
    const response = req.userInfo;
    console.log('en la ruta falsa: ', response)
    res.status(200).json(response)}))

  authServer.post('/test/logout',  async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Limpia la cookie de sesión del cliente
      res.clearCookie("connect.id");
      res.clearCookie("sessionId");
      res.redirect("/");
    });
  }),

authServer.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error';
    console.error('Error: ', err);
    //res.render('error', { message: message, status: status});
    res.status(status).json({
      success: false,
      data: null,
      message,
  });
});
export default authServer;