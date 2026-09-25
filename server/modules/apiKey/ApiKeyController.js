import * as eh from '../../errorHandler.js'

export class ApiKeyController {
    constructor(service){
        this.service = service
    }
    static responder(res, status, message= null, results = null,) {
    res.status(status).json({ message, results});
 }
    register = eh.catchController(async(req,res)=>{
        const data = req.body
        const response = await this.service.register(data)
        return ApiKeyController.responder(res, 201, '', response)
    })
    getAll = eh.catchController(async(req,res)=>{
        const options = {page:req.query.page, limit:req.query.limit}
        const {message, info, data}  = await this.service.getAllClients(options)
        return ApiKeyController.responder(res, 200, message, {info, data})
    })
    getClientById = eh.catchController(async(req,res)=>{
        const {id} = req.params
        const response = await this.service.getClientById(id)
        return ApiKeyController.responder(res, 200, '', response)
    })
    clientUpdater = eh.catchController(async(req,res)=>{
        const {id} = req.params
        const data = req.body
        const response = await this.service.clientUpdate(id, data)
        return ApiKeyController.responder(res, 200, '', response)
    })
    apiEnableDisable = eh.catchController(async(req,res)=>{
        const {id} = req.params
        const data = req.body
        const response = await this.service.apiKeyEnabledDisabled(id, data)
        return ApiKeyController.responder(res, 200, '', response)
    })
    clientDeleter = eh.catchController(async(req,res)=>{
        const {id} = req.params
        const response = await this.service.clientDelete(id)
        return ApiKeyController.responder(res, 200, '', response)
    })
    apiKeyDeleter = eh.catchController(async(req,res)=>{
        const {id} = req.params
        const response = await this.service.apiKeyDelete(id)
        return ApiKeyController.responder(res, 200, '', response)
    })

}