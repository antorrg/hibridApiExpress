import {User} from '../../database.js'
import UserService from '../../Classes/userService.js'
import UserController from '../../Classes/UserController.js'
import { deleteImageFromStorage } from '../../firebase.js'
import help from '../../helpers/generalHelp.js';
import { catchController } from '../../errorHandler.js';
import {generateToken}  from '../../utils/authConfig.js'
import env from '../../envConfig.js'

//* Instancia de servicio: (Se expone para usar en MVC metodo get)
const testHandlerImage= env.Status==='test'? false : true
const userService = new UserService(User, false, testHandlerImage, deleteImageFromStorage )//constructor(Model, useCache, useImage, deleteImages) 

//* Controladores REST:
const userController = new UserController(userService, help.userParser, help.emptyUser, true )//(service, parserFunction, emptyObject, isAdmin)

const appPath = env.Status==='production'? "/" : "http://localhost:5173/login"

export default {// Estos son los controladores REST que se importaran en landRouter.
    userCreate : userController.create,
    userGetAll : userController.getAll, //parserFunction = null, queryObject = null, emptyObject,
    userGetById : userController.getById,
    userUpdate : userController.update,
    userDelete : userController.delete,
    verifyPass : userController.verify,
    userUpgrade : userController.upgrade,
    userResetPass : userController.resetPassword,
    userUpdatePass : userController.modifyPassword,
    //funcion create para superusuario.
    //createSuperUser: userService.create,
    userService,

     loginController: catchController(async (req, res) => {
        const data = req.body;
        //console.log('soy data en el controller: ', {data})
        const response = await userService.login(data, false);
        //console.log(response);
        
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
          sameSite: "Strict", // Evitar CSRF
          maxAge: 1000 * 60 * 60, // 1 hora
        });
        const userResponse = help.userParser(response, true)
        res.status(200).json({ user: userResponse, token });
        
      }),
      logoutController: async (req, res, next) => {
        if (!req.session) {
            return res.status(400).json({ success: false, message: 'No session found.' });
        }
    
        req.session.isAuthenticated = false; // Marca como no autenticado
        req.session.destroy((err) => {
            if (err) {
                return next(err); // Manejo de errores
            }
            res.clearCookie("connect.sid"); // Limpia la cookie principal de sesión
            res.clearCookie("connect.id");
            res.clearCookie("sessionId");
            res.status(200).json({ success: true, message: 'Logout successfully.' });
        });
    },
    
}
