import express from 'express'
import { Client, ApiKey } from '../../database.js'
import { ApiKeyService } from './ApiKeyService.js'
import { ApiKeyController } from './ApiKeyController.js'
import { ApiMiddlewares } from './apiKeyMiddleware.js'

const service = new ApiKeyService(Client, ApiKey, true)
const cont = new ApiKeyController(service)
export const apiMiddleware = new ApiMiddlewares(service.apiKeyVerify.bind(service))
const apiKeyRouter = express.Router()
apiKeyRouter.post(
    '/',
    cont.register
)
apiKeyRouter.get(
    '/',
    cont.getAll
)
apiKeyRouter.get(
    '/:id',
    cont.getClientById
)
apiKeyRouter.put(
    '/:id',
    cont.clientUpdater
)
apiKeyRouter.patch(
    '/:id',
    cont.apiEnableDisable
)
apiKeyRouter.delete(
    '/:id',
    cont.clientDeleter
)
apiKeyRouter.delete(
    '/:id/apiKey',
    cont.apiKeyDeleter
)

export default apiKeyRouter