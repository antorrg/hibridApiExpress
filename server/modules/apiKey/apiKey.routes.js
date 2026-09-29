import express from 'express'
import { Validator } from 'req-valid-express'
import { Client, ApiKey } from '../../database.js'
import { ApiKeyService } from './ApiKeyService.js'
import { ApiKeyController } from './ApiKeyController.js'
import { ApiMiddlewares } from './apiKeyMiddleware.js'
import sch from './apiKeySchemas.js'
import { UuidHandler } from '../../utils/UuidHandler.js'

const service = new ApiKeyService(Client, ApiKey, true)
const cont = new ApiKeyController(service)
export const apiMiddleware = new ApiMiddlewares(service.apiKeyVerify.bind(service))
const apiKeyRouter = express.Router()

apiKeyRouter.post(
    '/',
    Validator.validateBody(sch.create),
    cont.register
)
apiKeyRouter.get(
    '/',
    Validator.validateQuery(sch.query),
    cont.getAll
)
apiKeyRouter.get(
    '/:id',
    Validator.paramId('id', UuidHandler.uuidRegex),
    cont.getClientById
)
apiKeyRouter.put(
    '/:id',
    Validator.paramId('id', UuidHandler.uuidRegex),
    Validator.validateBody(sch.update),
    cont.clientUpdater
)
apiKeyRouter.patch(
    '/:id',
    Validator.paramId('id', UuidHandler.uuidRegex),
    Validator.validateBody(sch.update),
    cont.apiEnableDisable
)
apiKeyRouter.delete(
    '/:id',
    Validator.paramId('id', UuidHandler.uuidRegex),
    cont.clientDeleter
)
apiKeyRouter.delete(
    '/:id/apiKey',
    Validator.paramId('id', UuidHandler.uuidRegex),
    cont.apiKeyDeleter
)

export default apiKeyRouter