import {catchController} from '../errorHandler.js'

class GenericController {
 constructor(service, parserFunction, emptyObject, isAdmin){
    this.service = service;
    this.parserFunction = parserFunction || null;
    this.emptyObject = emptyObject || null;
    this.isAdmin = isAdmin || false;
 }
 //Methods:
 static responder(res, status, success, message= null, results = null,) {
    res.status(status).json({success, message, results});
 }
 //Controllers:
 create = catchController(async (req, res) => {
    const {uniqueField, ...data} = req.body;
    const response = await this.service.create(data, uniqueField);
    return GenericController.responder(res, 201, true, "Created succesfuly!", response)
 });

 createVariant = catchController(async (req, res) => {
    if (!this.service || typeof this.service.createVariant !== 'function') {
        return GenericController.responder(res, 501, false,  "This function is not implemented in this service", null,);
    }
    const {uniqueField, ...data} = req.body;
    const response = await this.service.createVariant(data, uniqueField);
    return GenericController.responder(res, 201, true, "Created succesfully!", response)
 });
 login = catchController(async (req, res) => {
    if (!this.service || typeof this.service.login !== 'function') {
        return GenericController.responder(res, 501, false, "Login is not implemented in this service",null,);
    }
    const data  = req.body;
    const response = await this.service.login(data, this.parserFunction);
    return GenericController.responder(res, 200, true, "Login succesfully", response,);
});

getAll = catchController(async (req, res) => {
    const queryObject = req.query && Object.keys(req.query).length > 0 ? req.query : {};
   
    const response = await this.service.getAll(this.parserFunction, queryObject, this.emptyObject, this.isAdmin);
    if(response.cache===true){return GenericController.responder(res, 203, true,  null , response.data, )}
    return GenericController.responder(res, 200, true,  null , response.data, )
});

getById = catchController(async (req, res) => {
    const { id } = req.params;
    const queryObject = req.query || null;
    const response = await this.service.getById(id, this.parserFunction, queryObject, this.isAdmin);
    return GenericController.responder(res, 200, true, null, response, )
});

update = catchController(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await this.service.update(id, newData);
    return GenericController.responder(res, 200, true, "Updated succesfully", response )
});
patcher = catchController(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await this.service.patcher(id, newData);
    return GenericController.responder(res, 200, true, "Updated succesfully", response )
});

delete = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.delete(id, this.isHard);
    return GenericController.responder(res, 200, true, response,  null )
});


};

export default GenericController