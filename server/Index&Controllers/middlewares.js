import {GenericMidd, ProductMidd} from "../Classes/GenericMiddleware.js";
//Instancias de las clases de middlewares:
const createProductValidator = new ProductMidd(['title', 'logo', 'landing', 'info_header', 'info_body', 'url'], ['id', 'text', 'img'])

const createUserValidator = new GenericMidd(['email', 'password', 'role'])

const createLandingValidator = new GenericMidd(['title', 'info_header', 'picture', 'description'])


//Se extraen y exportan los metodos: 
export default {

validCreateProduct : createProductValidator.validateFieldsWithItems(),
//validUpdateProduct: createProductValidator.validateFieldsWithItems(['title', 'logo', 'landing', 'info_header', 'info_body', 'url', 'enable', 'saver', 'useImg'], ['id', 'text', 'img', 'enable', 'saver', 'useImg']),
validCreateUser : createUserValidator.validateFields,
validateLand : createLandingValidator.validateFields(),
validateUUid : createUserValidator.validateUUID('id'),
validateInt : createUserValidator.validateINT('id'),
validateEmail : createUserValidator.validateFieldContent('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),  //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
}
