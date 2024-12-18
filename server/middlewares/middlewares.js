import {GenericMidd, ProductMidd} from "../Classes/GenericMiddleware";

const productValidator = new ProductMidd(['title', 'logo', 'landing', 'info_header', 'info_body', 'url'], ['id', 'text', 'img'])

const userValidator = new GenericMidd(['email', 'password', 'role'])

const landingValidator = new GenericMidd(['title', 'info_header', 'picture', 'description'])

export default {

validateProduct : productValidator.validateFieldsWithItems,
validateUser : userValidator.validateFields,
validateUUid : userValidator.validateUUID,
validateInt : userValidator.validateINT,
validateField : userValidator.validateFieldContent,  //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
validateLand : landingValidator.validateFields,
}
