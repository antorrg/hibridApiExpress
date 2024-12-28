import BaseEndpoint from '../BaseClasses/BaseEndpoints';


export const userLogin = new BaseEndpoint('/api/v1/user', false)

export const userValid = new BaseEndpoint('/api/v1/user', true)

//export const loginUser = userLogin.post('/user/login',)//endpoint, data = {}, auxFunction = null, admin = false