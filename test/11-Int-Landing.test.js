import app from '../server/app.js'
import session from 'supertest-session'
const agent = session(app);

import {setTokens} from './helperTest/jwtHelper.js'
import * as store from './helperTest/testStore.js'
import * as prod from './helperTest/genericHelp.js'


describe('Test de rutas REST: Landing', () => {
   
    describe('Test de rutas Landing: "/api/v1/land": CRUD basico completo:', () => {

        describe('Rutas "/land/create", Creacion de portada.', () => {
           
            it('Deberia crear una portada', async () => {
                await setTokens()
                const token = store.getToken()
                const response = await agent
                    .post('/api/v1/land/create')
                    .send(prod.landingPage)
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body.message).toBe("Created succesfully!")
                expect(response.body.results).toMatchObject(prod.landingRetrieved)
            })
        })
        describe('Ruta "/land". Metodo GET obtencion de informacion', () => {
            it('Ruta "/land". Deberia responder con status 200 y retornar un array con la portada.', async () => {
                const token = store.getToken()
                const response = await agent
                    .get('/api/v1/land')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toEqual(prod.generalLandResponse);
            })
            
            it('Deberia responder con status 401 y retornar un error si el token no estuviera presente', async () => {
                const token = store.getToken()
                const response = await agent
                    .get(`/api/v1/land`)
                    .set('Authorization', `Bearer adsfakjfdkajsdsadjfsakdjfdsf`)
                    .expect(401);
                expect(response.body.message).toBe("Token invalido" )
            })
        })
        describe('Rutas "/land/:id". Metodo PUT actualizacion de landing', () => {
            it('Deberia responder con un status 200 y actualizar el landing', async() => {
                const token = store.getToken()
                const id = 1
                const newData = prod.bodyLandUpdate;
                const response = await agent
                    .put(`/api/v1/land/${id}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toMatchObject(prod.landUpdated)
            })
            it('Deberia responder con status 400 y un mensaje de error si faltan parametros', async()=>{
                const token = store.getToken()
                const id = 1
                const newData = prod.wrongBodyLandUpdate;
                const response = await agent
                    .put(`/api/v1/land/${id}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.message).toBe("Missing parameters: enable")
            })
        })
    })
})
