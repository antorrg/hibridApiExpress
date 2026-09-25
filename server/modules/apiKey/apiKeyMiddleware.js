import * as eh from '../../errorHandler.js'

export class ApiMiddlewares {
    constructor(validator){
        this.validator = validator
    }

    verifyApiKey = async(req, res, next) => {
        const apiKey = req.headers['x-api-key'] || req.headers['authorization']
        if(!apiKey || typeof apiKey !== 'string'){
            return next(eh.middError('missing apiKey', 400))
        }
        try {
            const verified = await this.validator(apiKey)
            if(!verified){
                return next(eh.middError('Access denied', 401))
            }
            req.apiKeyData = verified
            next()
        } catch(err) {
            next(err)
        }
    }
}