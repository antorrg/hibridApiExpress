import ProductService from '../server/Classes/ProductServices.js'
import * as store from './helperTest/testStore.js'
import * as help from './helperTest/genericHelp.js'
import clean from '../server/helpers/generalHelp.js'
import {redirectionImages } from './helperTest/imageServices.js'
import {Product, Item} from '../server/database.js'

const test = new ProductService(Product, Item, false,false, redirectionImages)
const testImage = new ProductService(Product, Item, redirectionImages, false)

describe('ProductServices Class Test, Product crud (product and item)', () => {

    describe('The "create" function for creating one pruducts e items', ()=>{
    it('Method "create": should create one product with the correct parameters', async() => {
      
      const response = await test.create(help.product, 'title', clean.productCleaner) //(data, uniqueField, parserFunction)
      expect(response).toBe('Product created successfully') 
    });
    it('Method "create": should throw an error when trying to create the same service twice', async() => {
      try {
          await test.create(help.product, 'title', clean.productCleaner)
      } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe(`This product title already exists`);
          expect(error.status).toBe(400);
      }
       });
    it('Method "addItem": should create one product with the correct parameters', async() => {
      
        const response = await test.addItem(help.itemCreate) //(data)
        expect(response).toBe('Item created successfully') 
    });
  });
  describe('Get functions for retrieving services or a single service ', () => {
      it('Function "getAll": should return an array with the services without parseFunction', async() => {
        const response = await test.getAll(null, null, null, false);
        const finalRes = response.data?.map(res =>clean.productCleaner(res))
          expect(finalRes).toEqual(help.genralProductResponse);
      });
      it('Function "getAll": should return an array with the services with parseFunction', async() => {
        const response = await test.getAll(clean.productCleaner, null, null, true);//(parserFunction, queryObject, emptyObject, isAdmin)
        expect(response.data).toEqual(help.genralProductResponse);
      });
      it('Function "getById": should return an object with the service without parseFunction', async() => {
        const id = 1;
        const response = await test.getById(id, null, null, true);
        const finalRes = clean.productCleaner(response, true)
          expect(finalRes).toEqual(help.productResponse);
      });
      it('Function "getById": should return an object with the service with parseFunction', async() => {
        const id = 1;
        const response = await test.getById(id, clean.productCleaner,null, true);
        expect(response).toEqual(help.productResponse);
      });
      it('Function "getDetail": should return an object with the service without parseFunction', async() => {
        const id = 1;
        const response = await test.getDetail(id, null, null, true);
        const finalRes = clean.aux(response, true)
          expect(finalRes).toEqual(help.itemResponse);
      });
      it('Function "getDetail": should return an object with the service with parseFunction', async() => {
        const id = 1;
        const response = await test.getDetail(id, clean.aux,null, true);
        expect(response).toEqual(help.itemResponse);
      });
    });
    describe('Update and patch functions for update of product or item ', () => {
      it('The Update function: Should update the product if the parameters are corrects', async() => {
        const id = 1;
      const newData = {id, url: 'pepe'}
      const response = await test.update(id, newData)
      const responseJs = clean.productCleaner(response)
      expect(responseJs).toMatchObject(help.productUpdated) 
       });
       it('The Patcher function: Should update the item if the parameters are corrects', async() => {
        const id = 1;
      const newData = {id, img: 'pepe'}
      const response = await test.patcher(id, newData)
      const responseJs = clean.aux(response, true)
      expect(responseJs).toMatchObject(help.itemUpdated) 
       });
    });
    describe('Delete functions: Delete an item and a product.', () => {
      it('Should delete one item if the parameters are corrects', async() => {
        const id = 1;
        const response = await test.delete(id,)
        expect(response).toBe('Item deleted successfully') 
      });
       it('Should delete one item if the parameters are corrects', async() => {
        const id = 1;
        const response = await test.deleteAll(id,)
        expect(response).toBe('Product and items asociated deleted successfully') 
      })
    })
})


//   describe('Function "update', () => { 
//     it('should update the element if the parameters are corrects', async() => {
//       const id = 1;
//       const newData = {id, enable: false}
//       const response = await test.update(id, newData)
//       const responseJs = help.landParser(response)
//       expect(responseJs).toMatchObject(help.dataUpdated) 
//     })
//   });
//   describe('Delete function .', () => {
//     it('should delete an element', async() => {
//       const id = 1;
//       const response = await test.delete(id)
//       expect(response).toBe('Landing deleted successfully')
//     });