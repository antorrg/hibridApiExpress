import * as eh from '../../errorHandler.js'
import {responder} from '../../utils/responder.js'


export class LetterController{
    constructor(service){
        this.service = service
    }
        create = eh.catchController(async(req,res)=>{
            const data = req.body
        const response = await this.service.createLetter(data)
        return responder(res, 201, 'Carta creada exitosamente', response)
    })
        getAll = eh.catchController(async(req,res)=>{
               const { page, limit} = req.context.query
        const response = await this.service.getAll(page, limit)
        return responder(res, 200, '', response)
    })
        getAllAdmin = eh.catchController(async(req,res)=>{
        const { page, aprobada, limit, tema } = req.context.query
        const response = await this.service.findAllLetters(page, aprobada, limit, tema)
        return responder(res, 200, `${response.data ? response.data.length : 0} cartas halladas`, response)
    })
        getById = eh.catchController(async(req,res)=>{
         const {id} = req.params
        const response = await this.service.getById(id)
        return responder(res, 200, 'Carta encontrada', response)
    })
        moderateLetter = eh.catchController(async(req,res)=>{
          const {id} = req.params
          const data = req.body
        const response = await this.service.moderateLetter(id, data)
        return responder(res, 200, 'Actualizacion exitosa', response)
    })
     delete= eh.catchController(async(req,res)=>{
          const {id} = req.params
        const response = await this.service.deleteLetter(id)
        return responder(res, 200, 'Borrado exitoso', response)
    })
}