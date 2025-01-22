import {Product, Item } from "../../server/database.js"
import ProductServices from "../../server/Classes/ProductServices.js"
import { productMock } from "./genericHelp.js"




//Creacion de producto para las pruebas de rutas MVC:
const mockProduct = new ProductServices(Product, Item, false,false, null)

const createMockProduct = async()=>{
    try{
        await mockProduct.create(productMock, "title", null)//(data, uniqueField, parserFunction)
        return "Success"
    }catch(error){
        console.error("Error al crear mockProduct: ", error)
    }

}
export default createMockProduct;

