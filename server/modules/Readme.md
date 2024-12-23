# Parametros necesarios al instanciar clases:

Aqui se encuentran los parametros que son necesarios para cada clase y su instancia a fin de tener un borrador a mano.

## Indice:

- [GemericService](#clase-genericservice)
- [ProductService](#usuarios)
- [GenericController](#clase-genericcontroller)
- [GenericMiddlewares](#clase-genericmiddlewares)

<hr>

## Clase `GenericService`

- [Indice](#indice)

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

## Clase `GenericController`

- [Indice](#indice)

Constructor: 

```javascript
class GenericController {
 constructor(service, parserFunction, emptyObject, isAdmin){
    this.service = service;
    this.parserFunction = parserFunction || null;
    this.emptyObject = emptyObject || null;
    this.isAdmin = isAdmin || false;
 }
}
```

Metodos: 

```javascript
//Metodo responder (formato en que saldra la info)
 res.status(status).json({success, message, results});

create = catchController(async (req, res) => {
    const {uniqueField, ...data} = req.body;
    const response = await this.service.create(data, uniqueField);})

 createVariant = catchController(async (req, res) => {
    const {uniqueField, ...data} = req.body;
    const response = await this.service.createVariant(data, uniqueField);})

login = catchController(async (req, res) => {
    const data  = req.body;
    const response = await this.service.login(data, this.parserFunction)})

getAll = catchController(async (req, res) => {
    const queryObject = req.query || null;
    console.log('req.query: ', queryObject)
    const response = await this.service.getAll(this.parserFunction, queryObject, this.emptyObject, this.isAdmin)})

getById = catchController(async (req, res) => {
    const { id } = req.params;
    const queryObject = req.query || null;
    const response = await this.service.getById(id, this.parserFunction, queryObject, this.isAdmin)})

update = catchController(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await this.service.update(id, newData)})

patcher = catchController(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const response = await this.service.patcher(id, newData)})

delete = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.delete(id)})


```

<hr>

## Clase GenericMiddlewares

- [Indice](#indice)

Constructor: 

```javascript
class GenericMidd {
    constructor(requiredFields = []) {
        this.requiredFields = requiredFields;
        this.validateFields = this.validateFields.bind(this);
        
    }}

// Forma de instanciar:
const xx = new GenericMidd(['item1', 'item2'])

```
Metodos: 

```javascript

const midd = xx.validateFields()
//Note: Si es necesario los paremetros pasados al metodo sobreescriben en ese caso los del contructor.
// Esto quita la necesidad de hacer una nueva instancia cada vez que hay que validar un nuevo campo.
//No se pueden agregar items, si se agregan es necesario incluir los antiguos tambien.
const user = xx.validateFields(['email', 'password', 'etc...'])

// Middleware para validar UUIDs en un campo específico
const validId =  xx.validateUUID('userId') 
// Es necesario declarar el nombre que tendrá el campo a validar, luego validId puede usarse directamente.

const validInteger = xx.validateINT('productId')
// Esto es lo mismo para el caso en el que el Id es un integer.

// Middleware para validar números en un campo específico
// En este caso trabaja en el body.
const validIntBody = xx.validateNumbers('fieldName') 

//Middleware para validar campos en el body por medio de Regex, con mensaje de error personalizado
 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validEmail =  xx.validateFieldContent('email', regex, 'Invalid email format')


```

La clase `ProductMidd` tambien esta en el mismo archivo, esta sobreescribe el metodo `validateFields` con `validateFieldsWithItems` y recibe por constructor dos parametros en dos arreglos: uno para el producto y otro para los items. Tambien se pueden agregar en la instancia personalizada ya que sigue el mismo tipo de implementacion que `validateFiels`.

```javascript
const productValidator = new ProductMidd(['uno', ['dos']],['a', ['b']])


const validOne = productValidator.validateFieldsWithItems(),
// O tambien:

const validTwo = productValidator.validateFieldsWithItems(['uno', 'dos', 'tres'], ['a', 'b', 'c', 'd']),
```

- [Indice](#indice)