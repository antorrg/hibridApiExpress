import {catchController} from '../errorHandler.js'
import GenericController from './GenericController.js';

class UserController extends GenericController{
 constructor(service, parserFunction, emptyObject, isAdmin){
    super(
        service, 
        parserFunction, 
        emptyObject, 
        isAdmin
    )
 }
 //Controllers:
 /**
     * Handles login and verification actions dynamically.
     * @param {Object} req - The request object containing user data.
     * @param {Object} res - The response object.
     * @param {String} action - The action to perform ('Login' or 'Verify').
     */

 #loginVerifyMethod = catchController(async (req, res, action) => {
    if (!this.service || typeof this.service.login !== 'function') {
        return GenericController.responder(res, 501, false, `${action} is not implemented in this service`,null,);
    }
    const isVerify = action==="Verify"? true : false;
    const data  = req.body;
    const response = await this.service.login(data, isVerify);
    return GenericController.responder(res, 200, true, `${action} succesfully`, response,);
});

login = (req, res) => this.#loginVerifyMethod(req, res, "Login")
verify = (req, res) => this.#loginVerifyMethod(req, res, "Verify")

 /**
     * Handles patch actions dynamically.
     * @private 
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {String} action - The patch action description.
     */

//metodo "Privado" en js, esto es genial!!
#patcherHandler = catchController(async (req, res, action) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await this.service.update(id, newData, this.parserFunction);
    return GenericController.responder(res, 200, true, `${action} successfully`, response);
});

resetPassword = (req, res) => this.#patcherHandler(req, res, "Reset password");
modifyPassword = (req, res) => this.#patcherHandler(req, res, "Update password")
upgrade = (req, res) => this.#patcherHandler(req, res, "Upgrade");


};

export default UserController