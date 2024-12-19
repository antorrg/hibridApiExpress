import * as store from './helperTest/testStore.js'
import controllerServer from './helperTest/controllerServer.js'
import session from 'supertest'
const agent = session(controllerServer);
import * as help from './helperTest/05-helpData.js'

describe('Test de rutas Usuario, Project, Landing', () => {
    
    describe('Test de rutas de usuario: "/api/v1/user": ', () => {
        describe('Ruta "user/create": Ruta de creacion de usuario', () => {
            it('Deberia responder con status 201 y retornar el usuario', async () => {
                const email = "josenomeacuerdo@hotmail.com";
                const password = 'L1234567'
                const picture = 'url'
                const role = 1;
                const response = await agent
                    .post('/test/user/create')
                    .send({ email, password, picture, role })
                    .expect('Content-Type', /json/)
                    .expect(201);
                    const result = help.userParser(response)
                expect(response.body.results).toMatchObject(help.respUserCreate)
                store.setUserId(response.body.results.id)
            })
            it('Deberia responder con status 400 si faltan parametros', async () => {
                const email = "josenomeacuerdo. ..otmail.com";
                const password = 'L1234567'
                const picture = 'url'
                const role = 1;
                const response = await agent
                    .post('/test/user/create')
                    .send({  email, password, picture, role })
                    .expect('Content-Type', /json/)
                    .expect(400);
                expect(response.body.message).toEqual("Invalid email format" )
            })
        })
    })
})

