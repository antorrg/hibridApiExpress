import BaseEndpoint from '../BaseClasses/BaseEndpoints';

//* Info 
// get(endpoint, params = {}, auxFunction = null, admin = false) 
//post(endpoint, data = {}, auxFunction = null, admin = false)
//put(endpoint, data = {}, auxFunction = null, admin = false)
//delete(endpoint, auxFunction = null, admin = false)

export const userLogin = new BaseEndpoint('/api/v1/user', false)

export const userValid = new BaseEndpoint('/api/v1/user', true)

//todo  Endpoints Landing:

const landingAdmin = new BaseEndpoint('/api/v1/land', true)

export const landingGet = ()=> landingAdmin.get('', null, null, true)

//todo Endpoinst Product:

const productAdmin = new BaseEndpoint('/api/v1/product', true)

export const productGet = ()=> productAdmin.get('', null, null, true)