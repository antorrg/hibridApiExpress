import {GenericMidd} from '../../Classes/GenericMiddleware.js'


const userMidd = new GenericMidd(['email'])



export default {
    validCreateUser: userMidd.validateFields(),
    loginUser : userMidd.validateFields(['email', 'password']),
    validatePassword: userMidd.validateFields(['id', 'password']),
    upgradeUser: userMidd.validateFields(['role', 'enable']),
    updateUser : userMidd.validateFields(['email', 'name','surname', 'picture', 'country']),
    validUUid : userMidd.validateUUID('id'),
    validPass : userMidd.validateFieldContent('password',/^(?=.*[A-Z]).{8,}$/, 'Invalid password. It must be at least 8 characters long and one uppercase letter.' ), //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
    validEmail : userMidd.validateFieldContent('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ,'Invalid email format'), //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
}