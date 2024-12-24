import { throwError } from "../errorHandler.js";
import  parser from '../helpers/generalHelp.js'
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt'


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
            
            return parserFunction ? parserFunction(newRecord) : newRecord;
            
        } catch (error) {
            throw error;
        }
    }
      async login(data, uniqueField= null, parserFunction = null) {
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
                return existingRecord
            } catch (error) {
                throw error;
            }
        }
    async getAll(parserFunction = null, queryObject = null, emptyObject= null, isAdmin = false) {
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
            const data = await this.Model.scope(isAdmin ? 'allRecords' : 'enabledOnly').findAll(query);
            if (data.length === 0) {
                emptyObject? emptyObject() :
                throwError(`The ${this.Model.name.toLowerCase()} table is empty!!`, 400);
            }
            
            const dataParsed = parserFunction ? data.map(dat => parserFunction(dat)) : data;
            if (this.useCache) {
                cache.set(cacheKey, dataParsed)}
                
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
                emptyObject? emptyObject() :
                throwError(`The ${this.Model.name.toLowerCase()} table is empty!!`, 400);
            }
            
            return parserFunction ? parserFunction(data) : data;
        } catch (error) {
            throw error;
        }
    }

    async update(id, newData, parserFunction=null) {
        let imageUrl =''
        try {
            const dataFound = await this.Model.findByPk(id);
            
            if (!dataFound) {
                throwError(`${this.Model.name} not found`, 404);
            }
            
            // Si newData.enable existe, parsea el booleano
            if (newData.enable !== undefined) {
                newData.enable = parser.optionBoolean(newData.enable);
            }
            if(this.useImage && dataFound.picture && dataFound.picture !== newData.picture){
             imageUrl= dataFound.picture;
            }
            
            const upData = await dataFound.update(newData);

            await this.handleImageDeletion(imageUrl);
            
            if (this.useCache) clearCache();
            return parserFunction ? parserFunction(upData) : upData;
        } catch (error) {
            throw error;
        }
    }

    async patcher(id, newData, parserFunction=null) {
        let imageUrl =''
        try {
            const dataFound = await this.Model.findByPk(id);
            
            if (!dataFound) {
                throwError(`${this.Model.name} not found`, 404);
            }
            
            // Si newData.enable existe, parsea el booleano
            if (newData.enable !== undefined) {
                newData.enable = parser.optionBoolean(newData.enable);
            }
            if(this.useImage && dataFound.picture && dataFound.picture !== newData.picture){
                imageUrl= dataFound.picture;
               }
            const upData = await dataFound.update(newData);

            await this.handleImageDeletion(imageUrl);
            
            if (this.useCache) clearCache();

            return parserFunction ? parserFunction(upData) : upData;
            //return `${this.Model.name} updated succesfully`;
        } catch (error) {
            throw error;
        }
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

                if (this.useCache) clearCache();
                return `${this.Model.name} deleted successfully`;
            
        } catch (error) {
            throw error;
        }
    }
}

export default GenericService;