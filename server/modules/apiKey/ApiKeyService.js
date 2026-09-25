import { UuidHandler } from '../../utils/UuidHandler.js'
import { QueryTypes } from 'sequelize'
import NodeCache from 'node-cache'
import { sequelize } from '../../database.js'
import * as eh from '../../errorHandler.js'
import { ApiKey } from './ApiKey.js'
import { clientParsed } from './helpers.js'

const apiKeyCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  maxKeys: 100,
  useClones: false
})

export class ApiKeyService{
    constructor(Client, KeyModel, useCache= false,){
        this.Client = Client
        this.KeyModel = KeyModel
        this.useCache = useCache
    }
    clearCache() {
        apiKeyCache.flushAll();
    }
    async #registerApiKey(data, transaction){
        const {clientId, name } = data
        const { toClient, toPersistence} = ApiKey.createApiKey(clientId)
        await this.KeyModel.create(toPersistence,{transaction})
        return {
            name,
            apiKey: toClient
        }
    }
    /**
     * 
     * @param {name: string, url:string} data 
     */
    async register(data){
        let t;
        try{
            t = await sequelize.transaction()
        const exists = await this.Client.findOne({where: {name: data.name}, transaction:t})
        if(exists){eh.throwError(`Client ${data.name} already exists`, 400)}
        const newData = {
            id: UuidHandler.createUuid(),
            name: data.name,
            url: data.url
        }
        const clientCreated = await this.Client.create(newData, {transaction:t})
        const result = await this.#registerApiKey({clientId: clientCreated.id, name: clientCreated.name},t)
       await t.commit()
        return result
    }catch(error){
              if (t) {
        await t.rollback();
      }
      throw error;
    }
    }
    async apiKeyVerify(key) {
    const parsed = ApiKey.parse(key)

    if (!parsed) {
        eh.throwError('Invalid API Key format', 400)
    }

    const { keyId, secret } = parsed

    let response = null

    if (this.useCache) {
        response = apiKeyCache.get(keyId) ?? null
    }

    if (!response) {
        response = await this.#searchClientAndApiKey(keyId)

        if (!response) {
            eh.throwError('Not found', 404)
        }

        if (this.useCache) {
            apiKeyCache.set(keyId, response)
        }
    }
    
    if (
        response.clientEnabled === false ||
        response.apiKeyEnabled === false
    ) {
        eh.throwError('Access denied', 401)
    }

    const keyMatch = ApiKey.verify(secret, response.keyHash)

    if (!keyMatch) {
        eh.throwError('Access denied', 401)
    }

    return {
        apiKeyId: response.apiKeyId,
        keyId: response.keyId,
        clientId: response.clientId,
        clientName: response.clientName,
        clientUrl: response.clientUrl
    }
    }
    // async apiKeyVerify(key){
    //     const parsed = ApiKey.parse(key)
    //     if(!parsed){eh.throwError('Invalid API Key format', 400)}
    //     const { keyId, secret } = parsed
    //             let cacheKey = `${keyId}`;
    //     if (this.useCache) { let cachedData = apiKeyCache.get(cacheKey);
    //         if (cachedData) {
    //             console.log('soy cache y funciono: ', keyId)
    //             return cachedData
    //         }
    //     }
    //     const response = await this.#searchClientAndApiKey(keyId)
    //     if(!response){eh.throwError('Not found', 404)}
    //     if(response.clientEnabled=== false || response.apiKeyEnabled ===false){eh.throwError('Access denied', 401)}
    //     const keyMatch = ApiKey.verify(secret, response.keyHash)
    //     if(keyMatch === false){eh.throwError('Access denied', 401)}
    //     if(response && this.useCache){
    //         apiKeyCache.set(keyId, response)
    //     }
    //     return {
    //             apiKeyId: response.apiKeyId,
    //             keyId: response.keyId,
    //             clientId: response.clientId,
    //             clientName: response.clientName,
    //             clientUrl: response.clientUrl
    //     }
    // }
    async getAllClients(options = {}){
      return await this.#getClients(options)
    }
    async getClientById(clientId){
        return await this.#getClientById(clientId)
    }
    async clientUpdate(id, data){
        const response = await this.#updateClient(id, data)
        if(this.useCache){this.clearCache()}
        return response
    }
    async clientDelete(id){
        const response = await this.#deleteClient(id)
            if(this.useCache){this.clearCache()}
        return response
        
    }
    async apiKeyEnabledDisabled(id, data){
        const response = await this.#disableEnabledItem(id, data)
            if(this.useCache){this.clearCache()}
        return response
    }
    async apiKeyDelete(id){
        const response = await this.#deleteKey(id)
            if(this.useCache){this.clearCache()}
        return response
    }

    /**
     * 
     *  Metodos privados que interactuan con ORM
     * @returns 
     */
    async #searchClientAndApiKey(keyId){

        const [api] = await sequelize.query(`
            SELECT
                ak."id" AS "apiKeyId",
                ak."keyId",
                ak."keyHash",
                ak."enabled" AS "apiKeyEnabled",
                c."id" AS "clientId",
                c."name" AS "clientName",
                c."url" AS "clientUrl",
                c."enabled" AS "clientEnabled"
            FROM "ApiKeys" AS ak
            INNER JOIN "Clients" AS c ON c."id" = ak."clientId"
            WHERE ak."keyId" = :keyId
            LIMIT 1
            `,
            {
                replacements: { keyId },
                type: QueryTypes.SELECT
            }
        )
         return api ?? null
    }

    async #getClients(options = {}){
        const page = parseInt(options.page, 10) || 1
        const limit = parseInt(options.limit, 10) || 5
        const offset = (page - 1) * limit
        const { count, rows } = await this.Client.findAndCountAll({
            include: [
                {
                    model: this.KeyModel,
                    attributes: ["id", "keyId", "enabled"],
                },
            ],
            offset: offset,
            limit: limit,
            distinct: true
        })   
        const pages = Math.ceil(count / limit) || 1
        return {
            message: `Clientes de pagina ${page} de ${pages}`,
            info: {
                currentPage: page, 
                totalPages: pages,
                totalElements: count
            },
            data: rows.map(r => clientParsed(r))
        }
    }

    async #getClientById(clientId){
        const response = await this.Client.findByPk(clientId, {
            include: [
                {
                    model: this.KeyModel,
                    attributes: ["id", "keyId", "enabled"],
                },
            ],
        })
        if (!response) {
            eh.throwError(`Cliente con ID ${clientId} no encontrado`, 404)
        }
        return clientParsed(response)
    }

    async #updateClient(id, data){
      const record = await this.Client.findByPk(id)

      if (!record) {
        eh.throwError(`Clientecon ID ${id} no encontrado`, 404)
      }

      await record.update(data)
      return {
        message: 'Cliente actualizado exitosamente'
      }
    }

    async #disableEnabledItem(id, data){
              const record = await this.KeyModel.findByPk(id)

      if (!record) {
        eh.throwError(`Registro ID ${id} no encontrado`, 404)
      }

      await record.update(data)
      return {
        message: 'Registro actualizado exitosamente'
      }
    }

    async #deleteKey(id){
        const record = await this.KeyModel.findByPk(id)

      if (!record) {
        eh.throwError(`Registro ID ${id} no encontrado`, 404)
      }

      await record.destroy()
      return {
        message: 'Registro borrado exitosamente'
      }
    }

    async #deleteClient(id){
        const record = await this.Client.findByPk(id)

      if (!record) {
        eh.throwError(`Registro ID ${id} no encontrado`, 404)
      }

      await record.destroy()
      return {
        message: 'Cliente borrado exitosamente'
      }
    }

}
/*
  apiKeyId: '',
  keyId: '',
  keyHash: '',
  apiKeyEnabled: '',
  clientId: '',
  clientName: '',
  clientUrl: '',
  clientEnabled: ''*/
  /*
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  OPERATION_FAILED: 'OPERATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_TYPE: 'INVALID_TYPE',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  VALUE_NOT_ALLOWED: 'VALUE_NOT_ALLOWED',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',

  // authorization
  ACCESS_DENIED: 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_NOT_ALLOWED: 'ROLE_NOT_ALLOWED',
  FORBIDDEN: 'FORBIDDEN',

  // resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',

  // system
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  SERVICE_TIMEOUT: 'SERVICE_TIMEOUT',
  DEPENDENCY_FAILURE: 'DEPENDENCY_FAILURE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // persistence
  DATA_READ_ERROR: 'DATA_READ_ERROR',
  DATA_WRITE_ERROR: 'DATA_WRITE_ERROR',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR',
  DATA_CONSTRAINT_VIOLATION: 'DATA_CONSTRAINT_VIOLATION',
  DATA_CONFLICT: 'DATA_CONFLICT',

  // security
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  CSRF_DETECTED: 'CSRF_DETECTED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  REQUEST_BLOCKED: 'REQUEST_BLOCKED',

  // operations
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  OPERATION_CONFLICT: 'OPERATION_CONFLICT',
  INVALID_OPERATION_STATE: 'INVALID_OPERATION_STATE',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',

  // files
  FILE_REQUIRED: 'FILE_REQUIRED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  FILE_DELETE_FAILED: 'FILE_DELETE_FAILED',


  // session
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_INVALID: 'SESSION_INVALID',
  CLIENT_STATE_INVALID: 'CLIENT_STATE_INVALID',

  // environment
  CONFIG_MISSING: 'CONFIG_MISSING',
  CONFIG_INVALID: 'CONFIG_INVALID',
  ENVIRONMENT_ERROR: 'ENVIRONMENT_ERROR'
  */