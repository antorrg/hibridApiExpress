import BaseEndpoints from '../BaseClasses/BaseEndpoints';

//* Info 
// get(endpoint, params = {}, auxFunction = null, admin = false) 
//post(endpoint, data = {}, auxFunction = null, admin = false, rejectfunction, message)
//put(endpoint, data = {}, auxFunction = null, admin = false, rejectfunction, message)
//delete(endpoint, auxFunction = null, admin = false, rejectfunction, message)
/**
 * data y tipos 
 * Post 
 */
//(endpoint, data = {}, auxFunction = null, admin = false, rejectFunction = null, message= 'Operación exitosa'
export const userLogin = new BaseEndpoints('/api/v1/user', false)

export const userValid = new BaseEndpoints('/api/v1/user', true)//* Para las tareas de edición usar esta instancia.

//todo  Endpoints Landing:

const landingAdmin = new BaseEndpoints('/api/v1/land', true)

export const landingCreate = (data, aux, auxReject)=> landingAdmin.post('create', data, aux, true, auxReject, 'Portada creada exitosamente')

export const landingGet = ()=> landingAdmin.get('', null, null, true)

export const landingGetById = (id)=> landingAdmin.get(`${id}`, null, null, true )

export const landingUpdate = (id, data, aux, auxReject)=> landingAdmin.put(`${id}`, data, aux, true, auxReject, 'Portada actualizada exitosamente')

export const landingDelete = (id, aux, auxReject)=> landingAdmin.delete(`/${id}`,aux, true, auxReject)

//todo Endpoints Product:

const productAdmin = new BaseEndpoints('/api/v1/product', true)

export const productGet = ()=> productAdmin.get('', null, null, true)

export const productGetById = (id)=> productAdmin.get(`${id}`, null, null, true)

export const createProduct = (data, aux, auxReject)=> productAdmin.post('create', data, aux, true, auxReject, 'Product create successfully')

export const updateProduct = (id, data, aux, auxReject)=> productAdmin.put(`${id}`, data, aux, true, auxReject)

export const deleteProduct = (id, aux, auxReject)=> productAdmin.delete(`${id}`,aux, true, auxReject)

//todo Endpoints Item

const itemAdmin = new BaseEndpoints('/api/v1/item', true)

export const createItem = (data, aux, auxReject)=> itemAdmin.post('create', data, aux, true, auxReject, 'Item creado exitosamente')

export const getItemById = (id)=> itemAdmin.get(`${id}`, null, null, true)

export const updateItem = (id, data, aux, auxReject)=> itemAdmin.put(`${id}`, data, aux, true, auxReject, 'Item actualizado exitosamente')

export const deleteItem = (id, aux, auxReject) => itemAdmin.delete(`${id}`,aux, true, auxReject)


//todo Endpoints User:

export const userGet = ()=> userValid.get('', null, null, true)

export const userGetbyid = (id, auxReject)=> userValid.get(`${id}`, null, null, true, auxReject)

export const userVerify = (data, aux, auxReject)=> userValid.post('verify',data, aux, true, auxReject )

export const userChangePass = (id, data, aux, auxReject)=> userValid.put(`update/${id}`, data, aux, true, auxReject)

export const userProfile = (id, data, aux, auxReject)=> userValid.put(`profile/${id}`, data, aux, true, auxReject)

export const userUpgrade = (id, data, aux, auxReject)=> userValid.put(`upgrade/${id}`, data, aux, true, auxReject)

export const userResetPass = (id, data, aux, auxReject)=> userValid.put(`reset/${id}`, data, aux, true, auxReject)

export const userCreate = (data, aux, auxReject)=> userValid.post('create',data, aux, true, auxReject )

export const userDelete = (id, aux, auxReject)=> userValid.delete(`${id}`,aux, true, auxReject)

//todo Endpoints ApiKey / Client:

const apiKeyAdmin = new BaseEndpoints('/api/v1/apikey', true)

export const getApiKeys = (page, limit) => apiKeyAdmin.get('', { page, limit }, null, true)

export const getApiKeyById = (id) => apiKeyAdmin.get(id, null, null, true)

export const createApiKeyClient = (data, aux, auxReject) => apiKeyAdmin.post('', data, aux, true, auxReject, 'Cliente API Key creado exitosamente')

export const updateApiKeyClient = (id, data, aux, auxReject) => apiKeyAdmin.put(id, data, aux, true, auxReject, 'Cliente actualizado exitosamente')

export const toggleApiKeyStatus = (id, data, aux, auxReject) => apiKeyAdmin.patch(id, data, aux, true, auxReject, 'Estado de API Key actualizado')

export const deleteApiKeyClient = (id, aux, auxReject) => apiKeyAdmin.delete(id, aux, true, auxReject, 'Cliente eliminado exitosamente')

export const deleteApiKey = (id, aux, auxReject) => apiKeyAdmin.delete(`${id}/apiKey`, aux, true, auxReject, 'API Key eliminada exitosamente')

//todo Endpoints Cartas / Letters:

const letterAdmin = new BaseEndpoints('/api/v1/letter', true)

export const letterGetAllAdmin = (params = {}) => letterAdmin.get('admin', params, null, true)

export const letterGetByIdAdmin = (id) => letterAdmin.get(`admin/${id}`, null, null, true)

export const letterModerateAdmin = (id, data, aux, auxReject) => letterAdmin.patch(`admin/${id}`, data, aux, true, auxReject, 'Estado de carta actualizado exitosamente')

export const letterDeleteAdmin = (id, aux, auxReject) => letterAdmin.delete(`admin/${id}`, aux, true, auxReject, 'Carta eliminada exitosamente')

