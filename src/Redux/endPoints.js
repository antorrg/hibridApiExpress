import BaseEndpoint from '../BaseClasses/BaseEndpoints';

//* Info 
// get(endpoint, params = {}, auxFunction = null, admin = false) 
//post(endpoint, data = {}, auxFunction = null, admin = false)
//put(endpoint, data = {}, auxFunction = null, admin = false)
//delete(endpoint, auxFunction = null, admin = false)
/**
 * data y tipos 
 * Post 
 */

export const userLogin = new BaseEndpoint('/api/v1/user', false)

export const userValid = new BaseEndpoint('/api/v1/user', true)//* Para las tareas de edición usar esta instancia.

//todo  Endpoints Landing:

const landingAdmin = new BaseEndpoint('/api/v1/land', true)

export const landingCreate = (data, aux)=> landingAdmin.post('create', data, aux)

export const landingGet = ()=> landingAdmin.get('', null, null, true)

export const landingGetById = (id)=> landingAdmin.get(`/${id}`, null, null, true )

export const landingUpdate = (id, data, aux)=> landingAdmin.put(`/${id}`, data, aux, true)

export const landingDelete = (id, aux)=> landingAdmin.delete(`/${id}`,aux, true)

//todo Endpoints Product:

const productAdmin = new BaseEndpoint('/api/v1/product', true)

export const productGet = ()=> productAdmin.get('', null, null, true)

export const productGetById = (id)=> productAdmin.get(`${id}`, null, null, true)

export const createProduct = (data, aux)=> productAdmin.post('create', data, aux, true, 'Product create successfully')

export const updateProduct = (id, data, aux)=> productAdmin.put(`${id}`, data, aux, true)

export const deleteProduct = (id, aux)=> productAdmin.delete(`${id}`,aux, true)

//todo Endpoints Item

const itemAdmin = new BaseEndpoint('/api/v1/item', true)

export const createItem = (data, aux)=> itemAdmin.post('create', data, aux, true)

export const getItemById = (id)=> itemAdmin.get(`${id}`, null, null, true)

export const updateItem = (id, data, aux)=> itemAdmin.put(`${id}`, data, aux, true)

export const deleteItem = (id, aux) => itemAdmin.delete(`${id}`,aux, true)


//todo Endpoints User:

export const userGet = ()=> userValid.get('', null, null, true)

export const userGetbyid = (id)=> userValid.get(`${id}`, null, null, true)

export const userUpdate = (id, data, aux)=> userValid.put(`${id}`, data, aux, true)

export const userCreate = (data, aux)=> userValid.post('create',data, aux, true )

export const userDelete = (id, aux)=> userValid.delete(`${id}`,aux, true)
