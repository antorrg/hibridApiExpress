import {Landing} from '../../database.js'
import GenericService from '../../Classes/genericService.js'
import GenericController from '../../Classes/GenericController.js'
import { deleteImageFromStorage } from '../../firebase.js'
import help from '../../helpers/generalHelp.js'; // dataEmptyLanding, cleanerLanding



//* Instancia de servicio: (Se expone para usar en MVC metodo get)
const landService = new GenericService(Landing, true, true, deleteImageFromStorage )//constructor(Model, useCache, useImage, deleteImages) 

//* Controladores REST:
const landController = new GenericController(landService, help.cleanerLanding, help.dataEmptyLanding, true )//(service, parserFunction, emptyObject, isAdmin)

export default {// Estos son los controladores REST que se importaran en landRouter.
    landCreate : landController.create(),
    landGetAll : landController.getAll(), //parserFunction = null, queryObject = null, emptyObject,
    landGetById : landController.getById(),
    landUpdate : landController.update(),
//* Aqui se expone la clase del servicio para MVC.
    landServGetAll: landService.getAll(help.cleanerLanding, null,help.dataEmptyLanding, false ),

}
