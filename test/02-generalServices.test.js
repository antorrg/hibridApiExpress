import GenericService from '../server/Classes/genericService.js'
import * as store from './helperTest/testStore.js'
import * as help from './helperTest/02-helpdata.js'
import {redirectionImages } from './helperTest/imageServices.js'
import {Landing} from '../server/database.js'

const test = new GenericService(Landing, false, false, redirectionImages) //(model, useCache, useImage)
const testCache = new GenericService(Landing, true, false, null ) //(model, useCache, useImage)
const testImage = new GenericService(Landing, false, true, redirectionImages) //(model, useCache, useImage, deleteImage)


describe('Unit testing of the GenericService class: CRUD operations.', ()=>{
 
  describe('The "create" function for creating a service', ()=>{
    it('should create an element with the correct parameters', async() => {
      const response = await test.create(help.element, 'title', help.landParser) //(data, uniqueField, parserFunction)
      expect(response).toMatchObject(help.dataCreated) 
    });
    it('should throw an error when trying to create the same service twice', async() => {
      const element = {name:'Hola'};
      try {
          await test.create(element)
      } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe(`This landing entry already exists`);
          expect(error.status).toBe(400);
      }
       });
  });
 
  describe('Get functions for retrieving services or a single service ', () => {
    it('Function "getAll": should return an array with the services without parseFunction', async() => {
      const response = await test.getAll();
      const finalRes = response.data.map(help.landParser)
        expect(finalRes).toEqual([help.dataCreated]);
    });
    it('Function "getAll": should return an array with the services with parseFunction', async() => {
      const response = await test.getAll(help.landParser, null, null, false);//(parserFunction, queryObject, emptyObject, isAdmin)
      expect(response.data).toEqual([help.dataCreated]);
    });
    it('Function "getById": should return an object with the service without parseFunction', async() => {
      const id = 1;
      const response = await test.getById(id);
      const finalRes = help.landParser(response)
        expect(finalRes).toEqual(help.dataCreated);
    });
    it('Function "getById": should return an object with the service with parseFunction', async() => {
      const id = 1;
      const response = await test.getById(id, help.landParser);
      expect(response).toEqual(help.dataCreated);
    });
  });
  describe('Get functions for retrieving services with cache functions ', () => {
    it('Function "getAll": should return response.cache = false', async() => {
      const response = await testCache.getAll();
        expect(response.cache).toBe(false);
    });
    it('Function "getAll": should return response.cache = true', async() => {
      const response = await testCache.getAll();
      expect(response.cache).toBe(true);
    });
  });
  describe('Function "update', () => { 
    it('should update the element if the parameters are corrects', async() => {
      const id = 1;
      const newData = {id, enable: false}
      const response = await test.update(id, newData)
      const responseJs = help.landParser(response)
      expect(responseJs).toMatchObject(help.dataUpdated) 
    })
  });
  describe('Delete function .', () => {
    it('should delete an element', async() => {
      const id = 1;
      const response = await test.delete(id)
      expect(response).toBe('Landing deleted successfully')
    });
    
  })
  xdescribe('Images managment', () => { 
    it('should delete old images when updating', async() => {
      await testImage.create(help.element, 'title', help.landParser)
      const id = 2
      const newData= {picture: "urlSecond"}
      const response = await testImage.update(id, newData)
      const responseJs = help.landParser(response)
      expect(responseJs).toMatchObject(help.dataImageUpdated ) 
     })
     it('should throw an error if there is a problem with the deletion', async() => {
      const id = 2
      const newData= {picture: "urlSecond"}
      const response = await testImage.update(id, newData)
      const responseJs = help.landParser(response)
      expect(responseJs).toMatchObject(help.dataImageUpdated ) 
     })
  })
})
