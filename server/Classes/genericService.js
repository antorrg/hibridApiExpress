import { throwError } from "../errorHandler.js";
import  parser from '../helpers/generalHelp.js'
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt'


const validator = parser.optionBoolean
const cache = new NodeCache({ stdTTL: 1800 }); // TTL (Time To Live) de media hora

class GenericService {
    constructor(Model, useCache= false, useImage= false, deleteImages = null) {
        this.Model = Model;
        this.useCache = useCache;
        this.useImage = useImage;
        this.deleteImages = deleteImages;
    }
    clearCache() {
        cache.del(`${this.Model.name.toLowerCase()}`);
    }
    
    async handleImageDeletion(imageUrl) {
        if (this.useImage && imageUrl) {
            await this.deleteImages(imageUrl);
        }
    }
    optionBoolean (save){
        if(save==='true'|| save === true){
            return true
        }else if(save==='false'|| save === false){
            return false;
        }else{
            return false;
        }
    }
    async create(data, uniqueField=null, parserFunction=null) {
        try {
            const whereClause = {};
            if (uniqueField) {
                whereClause[uniqueField] = data[uniqueField];
                
            }
           
            const existingRecord = await this.Model.findOne({where: whereClause });
            
            if (existingRecord) {
                throwError(`This ${this.Model.name.toLowerCase()} ${uniqueField || 'entry'} already exists`, 400);
            }
            
            const newRecord = await this.Model.create(data);

            if (this.useCache) this.clearCache();
            return parserFunction ? parserFunction(newRecord) : newRecord;
            
        } catch (error) {
            throw error;
        }
    }
      async login(data, uniqueField= null, isVerify=null) {
            try {
                let whereClause = {};
            if (uniqueField) {
                whereClause[uniqueField] = data[uniqueField];
            }
            
            
            const existingRecord = await this.Model.findOne({ where: whereClause });
                if (!existingRecord) {
                    throwError(`This ${this.Model.name.toLowerCase()} name do not exists`, 400);
                }
                if (!existingRecord.enable) {
                    throwError(`User is blocked`, 400);
                }
                const passwordMatch = await bcrypt.compare(data.password, existingRecord.password)
                if (!passwordMatch) {throwError('Invalid password', 400)}
                const response = isVerify? 'Verify succesfully' : existingRecord;
                return response;
            } catch (error) {
                throw error;
            }
        }
    async getAll(parserFunction = null, queryObject = null, emptyObject= null, isAdmin = false) {
        //console.log('service',emptyObject)
        let cacheKey = `${this.Model.name.toLowerCase()}`;
        if (this.useCache) { let cachedData = cache.get(cacheKey);
            if (cachedData) {
                return {
                    data: cachedData,
                    cache: true,
                };
            }
        }
        try {
            const query = queryObject? {where:queryObject}: {}; 
            let data = await this.Model.scope(isAdmin ? 'allRecords' : 'enabledOnly').findAll(query);
            if (data.length === 0) {
                emptyObject? data = [emptyObject]:
                throwError(`The ${this.Model.name.toLowerCase()} table is empty!!`, 400);
            }
            
           const dataParsed = parserFunction ? data.map(dat => parserFunction(dat)) : data;
            //console.log('soy la data: ', dataParsed)
            if (this.useCache) {
                cache.set(cacheKey, dataParsed)}
                //console.log(dataParsed)
            return {data: dataParsed,
                   cache: false
                   }
        } catch (error) {
            throw error;
        }
    }
    async getById(id, parserFunction = null, emptyObject= null,isAdmin = false) {
        try {
            //const data = await this.Model.findByPk(id);
            const data = await this.Model.scope(isAdmin ? 'allRecords' : 'enabledOnly').findByPk(id);
            
            if (!data) {
                emptyObject? emptyObject :
                throwError(`The ${this.Model.name.toLowerCase()} table is empty!!`, 400);
            }
            
            return parserFunction ? parserFunction(data) : data;
        } catch (error) {
            throw error;
        }
    }
      /**
     * Método privado para realizar actualizaciones genéricas.
     * @param {string|number} id - Identificador del registro.
     * @param {Object} newData - Datos nuevos para actualizar.
     * @param {Function|null} parserFunction - Función opcional para procesar los datos.
     * @returns {Promise<Object>} Resultado de la operación.
     */
    async #generalUpdater(id, newData, parserFunction=null) {
       // console.log('soy el id en el service : ', id)
        //console.log('soy newData en el service : ', newData)
       
        let imageUrl =''
        try {
            const dataFound = await this.Model.findByPk(id);
            
            if (!dataFound) {
                throwError(`${this.Model.name} not found`, 404);
            }
            
            // Si newData.enable existe, parsea el booleano
            if (newData.enable !== undefined) {
                newData.enable = this.optionBoolean(newData.enable);
            }
            if(this.useImage && dataFound.picture && dataFound.picture !== newData.picture){
             imageUrl= dataFound.picture;
            }
            
            const upData = await dataFound.update(newData);

            await this.handleImageDeletion(imageUrl);
            
            if (this.useCache) this.clearCache();
            return parserFunction ? parserFunction(upData) : upData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza completamente un registro.
     * @param {string|number} id - Identificador del registro.
     * @param {Object} newData - Datos nuevos.
     * @param {Function|null} parserFunction - Función opcional para procesar los datos.
     * @returns {Promise<Object>} Resultado de la operación.
     */
    async update(id, newData, parserFunction) {
        return this.#generalUpdater(id, newData, parserFunction);
    }

    
    async delete(id) {
        let imageUrl =''
        try {
            const dataFound = await this.Model.findByPk(id);
            if (!dataFound) {
                throwError(`${this.Model} not found`, 404);
            }
            this.useImage? imageUrl = dataFound.picture : '';
            
                await dataFound.destroy();
                await this.handleImageDeletion(imageUrl);

                if (this.useCache) this.clearCache();
                return `${this.Model.name} deleted successfully`;
            
        } catch (error) {
            throw error;
        }
    }
}

export default GenericService;