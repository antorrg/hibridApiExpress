import {GenericMidd} from '../../Classes/GenericMiddleware.js'


const userMidd = new GenericMidd(['email', 'password'])



export default {
    loginUser : userMidd.validateFields(),
    updateUser : userMidd.validateFields(['email', 'password', 'role', 'picture', 'enable']),
    validUUid : userMidd.validateUUID('id'),
    validPass : userMidd.validateFieldContent('password',/^(?=.*[A-Z]).{8,}$/, 'Invalid password. It must be at least 8 characters long and one uppercase letter.' ), //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
    validEmail : userMidd.validateFieldContent('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ,'Invalid email format'), //parametros: ('fieldName', 'fieldRegex', 'errorMessage')
}