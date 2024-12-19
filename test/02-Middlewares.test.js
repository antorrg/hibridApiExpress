import testServer from './helperTest/testServerMidd.js'
import session from 'supertest'
const agent = session(testServer)
import * as store from './helperTest/testStore.js'


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
     })
})



// describe('Middleware "holderCreate", de validacion de usuario (creacion y login)', ()=>{
//     it('Deberia permitir el paso si el email y el password son correctos', async()=>{
//         const user = {email: 'usuarioejemplo@nose.com', password: "L1234567"}
//         const response = await agent
//          .post(`/test/user/create`)
//          .send(user)
//          .expect('Content-Type', /json/)
//          .expect(200)
//          expect(response.body).toEqual({ message: 'Passed middleware' })
//     })
//     it('Deberia arrojar un error si faltara el email', async()=>{
//         const user = {password: "L1234567"}
//         const response = await agent
//          .post(`/test/user/create`)
//          .send(user)
//          .expect('Content-Type', /json/)
//          .expect(400)
//          expect(response.body).toEqual({ error: "missing email" })
//     })
//     it('Deberia arrojar un error si el formato del email no es correcto', async()=>{
//         const user = {email: 'usuarioejemplo@nosecom', password: "L1234567"}
//         const response = await agent
//          .post(`/test/user/create`)
//          .send(user)
//          .expect('Content-Type', /json/)
//          .expect(400)
//          expect(response.body).toEqual({ error: "invalid email format" })
//     })