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
