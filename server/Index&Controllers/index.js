import * as db from "../database.js";
import GenericController from "../Classes/GenericController.js";
import GenericService from "../Classes/genericService.js";
import UserService from "../Classes/userService.js";
import ProductServices from "../Classes/ProductServices.js";

//Aqui se instancian las clases y generan las funciones de servicio.

//*Parametros de clase: (Model, useCache= false, useImage= false, deleteImages = null)

const productService = new ProductServices(db.Product, db.Item);//doble modelo

const userService = new UserService(db.User, );

const landingService = new GenericService(db.Landing);

export default {
  userRest: new GenericController(userService),
  productRest: new GenericController(productService),
  landRest: new GenericController(landingService),
  productService,
  landingService,
};
