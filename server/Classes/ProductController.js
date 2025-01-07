import GenericController from "./GenericController.js";
import { catchController } from "../errorHandler.js";

class ProductController extends GenericController {
  constructor(service, parserFunction, parserFunction2, emptyObject, isAdmin) {
    super(service, parserFunction, emptyObject, isAdmin);
    this.parserFunction2 = parserFunction2;
  }

  createVariant = catchController(async (req, res) => {
    if (!this.service || typeof this.service.addItem !== 'function') {
        return GenericController.responder(res, 501, false,  "This function is not implemented in this service", null,);
    }
    const data = req.body;
    const response = await this.service.addItem(data);
    return GenericController.responder(res, 201, true, "Created succesfully!", response)
 });

  // Método para obtener detalles de un producto por ID
  getDetail = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.getDetail(id, this.parserFunction2, null, this.isAdmin);
    return GenericController.responder(res, 200, true, null, response);
  });

  patcher = catchController(async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    //console.log('etoy in classes', req.body)
    const response = await this.service.patcher(id, newData, this.parserFunction2);
    return GenericController.responder(res, 200, true, "Updated succesfully", response )
});

  // Método para eliminar todos los productos
  deleteAll = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.deleteAll(id);
    return GenericController.responder(res, 200, true, null, response);
  });
}

export default ProductController;
