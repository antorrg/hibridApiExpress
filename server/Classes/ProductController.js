import GenericController from "./GenericController.js";
import { catchController } from "../errorHandler.js";

class ProductController extends GenericController {
  constructor(service, parserFunction, parserFunction2, emptyObject, isAdmin) {
    super(service, parserFunction, emptyObject, isAdmin);
    this.parserFunction2 = parserFunction2;
  }

  // Método para obtener detalles de un producto por ID
  getDetail = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.getDetail(id, this.parserFunction2, null, this.isAdmin);
    return GenericController.responder(res, 200, true, null, response);
  });

  // Método para eliminar todos los productos
  deleteAll = catchController(async (req, res) => {
    const { id } = req.params;
    const response = await this.service.deleteAll(id);
    return GenericController.responder(res, 200, true, null, response);
  });
}

export default ProductController;
