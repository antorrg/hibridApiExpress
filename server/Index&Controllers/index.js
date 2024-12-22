import * as db from "../database.js";
import { catchController } from "../errorHandler.js";
import {deleteImageFromStorage} from '../firebase.js'
import GenericController from "../Classes/GenericController.js";
import GenericService from "../Classes/genericService.js";
import UserService from "../Classes/userService.js";
import ProductServices from "../Classes/ProductServices.js";
import clean from '../helpers/generalHelp.js'
import {generateToken} from '../authConfig.js'
//Aqui se instancian las clases y generan las funciones de servicio.

//*Parametros de clase: (Model, useCache= false, useImage= false, deleteImages = null)

const productService = new ProductServices(db.Product, db.Item);//doble modelo

const userService = new GenericService(db.User, false, true, deleteImageFromStorage);

const landingService = new GenericService(db.Landing);

export default {
  userRest: new GenericController(userService, clean.userParser, true),
  productRest: new GenericController(productService),//
  landRest: new GenericController(landingService),
  productService, //funciones de servicio
  landingService, //funciones de servicio

  //controllers funcionales para el inicio y fin de sesion.
  loginController: catchController(async (req, res) => {
    const data = req.body;
    const response = await userService.login(data, 'email',null);
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
    const userResponse = clean.userParser(response, true)
    res.status(200).json({ user: userResponse, token });
    
  }),

  logoutController: async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // Limpia la cookie de sesión del cliente
      res.clearCookie("connect.id");
      res.clearCookie("sessionId");
      res.redirect("/");
    });
  },
};
