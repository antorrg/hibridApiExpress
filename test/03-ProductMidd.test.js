import testServer from './helperTest/testServerMidd.js'
import session from 'supertest'
const agent = session(testServer)



describe('Middlewares test.Validate methods of the ProductMidd class', () => {
    describe('The validateFields method (constructor parameters)', () => {
       it('Should allow passage if the parameters are present and correct', async() => {
           const body = {title: 'titulo', description: "descripcion", items: [{img:"", text: "ttt"}, {img:"", text: "ttt"}]}
           const response = await agent
            .post(`/test/product/create`)
            .send(body)
            .expect('Content-Type', /json/)
            .expect(200)
            expect(response.body).toEqual({ message: 'Passed middleware' })
       });
       it('Should throw an error if a parameter is missing', async() => {
           const land = { description: "descripcion" , items: [{img:"", text: "ttt"}, {img:"", text: "ttt"}]}
           const response = await agent
            .post(`/test/product/create`)
            .send(land)
            .expect('Content-Type', /json/)
            .expect(400)
            expect(response.body.message).toEqual("Missing parameters: title")
       })
       it('Should throw an error if a item parameter is missing', async() => {
        const land = { title: 'titulo', description: "descripcion" , items: [{ text: "ttt"}, {img:"", text: "ttt"}]}
        const response = await agent
         .post(`/test/product/create`)
         .send(land)
         .expect('Content-Type', /json/)
         .expect(400)
         expect(response.body.message).toEqual("Missing parameters in items[0]: img")
    })
    });
    describe('The validateFields method (method parameters)', () => {
        it('Should allow passage if the parameters are present and correct', async() => {
            const body = {title: 'titulo', description: "descripcion", enable:'enable', saver:'saver', items: [{img:"", text: "ttt", enable: 'jdd'}, {img:"", text: "ttt", enable:'idid'}]}
            const id =2
            const response = await agent
             .put(`/test/product/create/${id}`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(200)
             expect(response.body).toEqual({ message: 'Passed middleware' })
        });
        it('Should throw an error if a parameter is missing', async() => {
            const body = { description: "descripcion" ,enable:'enable', saver:'saver', items: [{img:"", text: "ttt", enable: 'ennn'}, {img:"", text: "ttt", enable: 'ennn'}]}
            const id =2
            const response = await agent
             .put(`/test/product/create/${id}`)
             .send(body)
             .expect('Content-Type', /json/)
             .expect(400)
             expect(response.body.message).toEqual("Missing parameters: title")
        })
        it('Should throw an error if a item parameter is missing', async() => {
         const body = { title: 'titulo', description: "descripcion" ,enable:'enable', saver:'saver', items: [{ text: "ttt", enable: 'ennn'}, {img:"", text: "ttt", enable: 'jdjdjd'}]}
         const id =2
         const response = await agent
          .put(`/test/product/create/${id}`)
          .send(body)
          .expect('Content-Type', /json/)
          .expect(400)
          expect(response.body.message).toEqual("Missing parameters in items[0]: img")
     })
     });
});