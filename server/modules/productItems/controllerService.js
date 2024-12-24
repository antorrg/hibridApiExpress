import {Product, Item} from '../../database.js'
import ProductService from '../../Classes/genericService.js'
import ProductController from '../../Classes/ProductController.js'
import { deleteImageFromStorage } from '../../firebase.js'
import help from '../../helpers/generalHelp.js';

const productService = new ProductService(Product, Item, true, true, deleteImageFromStorage )//Model, Model2, useCache, useImage , deleteFunction

// controladores REST:

const productController = new ProductController(productService, help.productCleaner,help.aux, help.dataEmptyPage, true )//(service, parserFunction, emptyObject, isAdmin)

export default {
    createProduct : productController.create,
    createItem : productController.createVariant,
    getProduct : productController.getAll,
    getProductById : productController.getById,
    getItem : productController.getDetail,
    updateProduct : productController.update,
    updateItem : productController.patcher,
    deleteItem: productController.delete,
    deleteProduct: productController.deleteAll,
    //data para MVC:
    //getProdMvc : ProductService.getAll(help.productCleaner, null, help.dataEmptyPage, false),
    //getProdByIdMvc : ProductService.getById(id, help.cleanerLanding, null, false),
    //getItemMvc :  ProductService.getDetail(id, help.aux, null, false),
    
}