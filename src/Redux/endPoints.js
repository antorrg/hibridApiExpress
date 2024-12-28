import BaseEndpoint from '../Utils/BaseEndpoints';


export const userLogin = new BaseEndpoint('/api/v1/user', false)
export const userLogout = new BaseEndpoint('/api/v1/user', false)

//export const loginUser = userLogin.post('/user/login',)//endpoint, data = {}, auxFunction = null, admin = false