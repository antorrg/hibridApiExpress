import testServer from './helperTest/testServerMidd.js'
import session from 'supertest'
const agent = session(testServer)

//todo Funciones a verificar y sus parametros: 
// const validUpdateFields = genericmidd.validateFields(['title', 'info_header', 'description', 'picture', 'enable', 'useImg'])
// const validUUid = genericmidd.validateUUID('userId')
// const validInteger = genericmidd.validateINT('productId')
// const validFieldBody = genericmidd.validateNumbers('price')
// const regexValidEmail = genericmidd.validateFieldContent('email', '/^[^\s@]+@[^\s@]+\.[^\s@]+$/', 'Invalid email format')//(fieldName, fieldRegex, errorMessage)


describe('Middlewares test.Validate methods of the GenericMidd class', () => {
     describe('The validateFields method (constructor parameters)', () => {
        it('Should allow passage if the parameters are present and correct', async() => {
            const land = {title: 'titulo', description: "descripcion", picture : 'url'}
            const response = await agent
             .post(`/test/land/create`)
             .send(land)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
        });
        it('Should throw an error if a parameter is missing', async() => {
            const land = {title: 'titulo', description: "descripcion"}
            const response = await agent
             .post(`/test/land/create`)
             .send(land)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual("Missing parameters: picture")
        })
     });
     describe('The validUUID middleware. UUID validation.', () => {
          it('Should pass if the UUID is valid', async() => {
               const userId = "c1d970cf-9bb6-4848-aa76-191f905a2edd"
            const response = await agent
             .get(`/test/users/${userId}`)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
          });
          it('Should throw an error if the UUID is not valid', async() => {
               const userId = "c1d970cf-9bb6-4848-aa76191f905a2eddd"
            const response = await agent
             .get(`/test/users/${userId}`)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The c1d970cf-9bb6-4848-aa76191f905a2eddd field must be a valid UUID')
          });
          it('Should throw an error if the UUID is missing', async() => {
               const userId= 2; //c1d970cf-9bb6-4848-aa76191f905a2eddd
            const response = await agent
             .get(`/test/users/${userId}`)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The 2 field must be a valid UUID')
          })
     });
     describe('The validINT middleware. Integer validation.', () => {
          it('Should pass if the email format is valid', async() => {
               const productId = 55
            const response = await agent
             .get(`/test/land/${productId}`)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
          });
          it('Should throw an error if the Integer ID is not valid', async() => {
               const productId = "c1d970cf-9bb6-4848-aa76191f905a2eddd"
            const response = await agent
             .get(`/test/land/${productId}`)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The productId must be a integer number.')
          });
          it('Should throw an error if the Integer ID is not an integer', async() => {
               const productId = 4.8
            const response = await agent
             .get(`/test/land/${productId}`)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The productId must be a integer number.')
          });
          it('Should throw an error if the Integer ID is not valid', async() => {
            const productId = false
         const response = await agent
          .get(`/test/land/${productId}`)
          .expect('Content-Type', /json/)
          .expect(400)
          expect(response.body.message).toEqual('The productId must be a integer number.')
       });
         
     });
   
     describe('The validateNumbers middleware. Integer validation.', () => {
          it('Should pass if the Integer body is valid', async() => {
               const body= {price : 55, color : "white"}
               const id = 15
            const response = await agent
             .put(`/test/product/${id}`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
          });
          it('Should throw an error if the Integer body  is not a number', async() => {
               const body= {price : "black", color : "white"}
               const id = 15
            const response = await agent
             .put(`/test/product/${id}`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The price must be a integer number.')
          });
          it('Should throw an error if the Integer body  is not an integer Id valid', async() => {
               const body= {price : -55.5, color : "white"}
               const id = 15
            const response = await agent
             .put(`/test/product/${id}`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('The price must be a integer number.')
          });
         
     })
     describe('The validateFieldContent middleware. Regex validation.', () => {
          it('Should pass if the email format is valid', async() => {
               const body= {price : 55, email : "usuario@ejemplo.com"}
              
            const response = await agent
             .post(`/test/users`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
          });
          it('Should throw an error if the email format is not valid', async() => {
               const body= {price : 55, email : "usuario@ejemplocom"}
            const response = await agent
             .post(`/test/users`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual('Invalid email format')
          });
     })
});