# Requerimientos de constructor y metodos clase `GenericService`

Constructor:

```javascript
class GenericService {
    constructor(Model, useCache= false, useImage= false, deleteImages = null) {
        this.Model = Model;
        this.useCache = useCache;
        this.useImage = useImage;
        this.deleteImages = deleteImages;
    }
```
Metodos: 
```javascript
async create(data, uniqueField=null, parserFunction=null) 

async login(data, uniqueField= null, parserFunction = null)

async getAll(parserFunction = null, queryObject = null, emptyObject= null, isAdmin = false)

async getById(id, parserFunction = null, emptyObject= null,isAdmin = false)

async update(id, newData, parserFunction=null) 

async patcher(id, newData, parserFunction=null)

async delete(id)

```


<hr>

## Requerimientos de constructor y metodos clase `GenericController`

Constructor: 

```javascript
class GenericController {
 constructor(service, parserFunction, isAdmin){
    this.service = service;
    this.parserFunction = parserFunction || null;
    this.isAdmin = isAdmin || false;
 }
}
```

Metodos: 

```javascript

```

class GenericController {
 constructor(service, parserFunction, isAdmin){
    this.service = service;
    this.parserFunction = parserFunction || null;
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
    const queryObject = req.query || null;
    console.log('req.query: ', queryObject)
    const response = await this.service.getAll(this.parserFunction, queryObject, this.isAdmin);
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