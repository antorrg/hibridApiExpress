import UserService from '../server/Classes/userService.js';
import {User} from '../server/database.js'
import * as store from './helperTest/testStore.js'
import app from '../server/app.js'
import session from 'supertest-session'
const agent = session(app);
import * as help from './helperTest/06-helpData.js'

//* Por causa de los métodos de creación (con usuario preexistente) el usuario debe crearse antes.

const userMock = new UserService(User, false, false, null )//constructor(Model, useCache, useImage, deleteImages) 

describe('Test de rutas REST:  Usuario, Project, Landing', () => {
    
    describe('Test de rutas de usuario: "/api/v1/user": ', () => {
        describe('Ruta "user/login": Ruta de validacion de usuario', () => {
            it('Deberia responder con status 200 y retornar el usuario con el token', async () => {
                // Creacion de usuario:
                const data = {email:'josenomeacuerdo@hotmail.com', password:'L1234567', role: 1, picture: 'url'}
                const newUser = await userMock.create(data, 'email', null)
                const email = "josenomeacuerdo@hotmail.com";
                const password = 'L1234567'
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(response.body.user).toMatchObject(help.userLogged)
                store.setToken(response.body.token)
                
            })
            it('Deberia responder con status 400 si faltan parametros', async () => {
                const email = "josenomeacuerdo@hotmail.com";
                const password = ''
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(400);
                expect(response.body).toEqual({ error: "Invalid password. It must be at least 8 characters long and one uppercase letter."})
            })
        });
        describe('Ruta "user/create": Ruta de creacion de usuario', () => {
            it('Deberia responder con status 201 y retornar el usuario', async () => {
                const token = store.getToken();
                const data = {email:"juangarcia@gmail.com"};
                const response = await agent
                    .post('/api/v1/user/create')
                    .send(data)
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body).toEqual(help.respUserCreate)
                store.setUserId(response.body.results.id)
            })
            it('Deberia responder con status 400 si faltan parametros', async () => {
                const token = store.getToken();
                const data = {};
                const response = await agent
                    .post('/api/v1/user/create')
                    .send(data)
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(400);
                expect(response.body).toEqual({ error: "Email is required" })
            })
        })
      
        describe('Rutas "/user", "/user/:id: Rutas protegidas por token', () => {
            it('Ruta "user": Deberia responder con status 200 y retornar un array de usuarios', async () => {
                const token = store.getToken();
                const response = await agent
                    .get('/api/v1/user')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toEqual(help.respUserGet);
            })
            it('Deberia arrojar un error 401 si el token no estuviera presente', async () => {
                const response = await agent
                    .get('/api/v1/user')
                    .expect(401);
                expect(response.body).toEqual({ error: 'Acceso no autorizado. Token no proporcionado' });
            })
            it('Ruta "/user/:id": Deberia responder con status 200 y retornar un usuario', async () => {
                const token = store.getToken();
                const userId = store.getUserId()
                const response = await agent
                    .get(`/api/v1/user/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toMatchObject(help.respGetById);
            })
            it('Deberia arrojar un error 401 si el token no fuera el correcto', async () => {
                const userId = store.getUserId()
                const response = await agent
                    .get(`/api/v1/user/${userId}`)
                    .set('Authorization', `Bearer 'eyW9yb2RyaWd1ZXp0a2RAZ21haWwuY29tIiwicmeHAiOjE3MTk2OTI3MjZ9.7Onxx2MjQdeJF-KccG'`)
                    .expect(401);
                expect(response.body).toEqual({ error: 'Token invalido' });
            })
        })
        xdescribe('Ruta "/user/:id" actualizacion de usuario (ruta protegida con token).', () => {
            it('Deberia recibir un status 200 al actualizar un usuario con exito', async () => {
                const userId = store.getUserId();
                const newData = help.newUser;
                const token = store.getToken()
                const response = await agent
                    .put(`/api/user/${userId}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toMatchObject(help.updatedUser)
            })
            it('Deberia arrojar un status 400 si faltaran parametros', async () => {
                const userId = store.getUserId();
                const token = store.getToken()
                const response = await agent
                    .put(`/api/user/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body).toEqual({ error: 'Missing body' })
            })
        })
        xdescribe('Ruta "/user/" de verificacion de password', () => {
            it('Deberia retornar un status 200 y un mensaje de verificacion aprobada', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/user/sec`)
                    .send({ id, password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toEqual({ message: "Password successfully verified" })
            })
            it('Deberia retornar un status 401 y un mensaje de error por falta de validacion.', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/user/sec`)
                    .send({ id, password })
                    .expect(401);
                expect(response.body).toEqual({ error: 'Acceso no autorizado. Token no proporcionado' })
            })
        })
        xdescribe('Ruta "/user/:id" de actualizacion de password', () => {
            it('Deberia retornar un status 200 y un mensaje de actualizacion exitosa', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .patch(`/api/user/sec/${id}`)
                    .send({ password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toBe("Password updated successfully")
            })
            it('Deberia retornar un status 401 y un mensaje error por token invalido', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = 'asoifasdofisadoifasdoifjsoadfi'
                const response = await agent
                    .patch(`/api/user/sec/${id}`)
                    .send({ password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(401);
                expect(response.body).toEqual({ error: 'Token invalido' })
            })
        })
    })
    xdescribe('Test de rutas Project: "/api/v1/project": CRUD basico completo:', () => {
        describe('Rutas "/project/create", "/project/create/item", Creacion de proyecto e item.', () => {
            it('Deberia crear un proyecto con algunos items (más de uno)', async () => {
                const response = await agent
                    .post('/api/project/create')
                    .send(page.bodyPage)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body).toMatchObject(page.responsePage)
            })
            it('Ruta "/project/item/create". Deberia crear un item individualmente', async () => {
                const id = 1; //El id de page para relacionar
                const img = "url";
                const text = "Texto de prueba"
                const response = await agent
                    .post('/api/project/item/create')
                    .send({ id, img, text })
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body).toBe("Item creado exitosamente")
            })
        })
        xdescribe('Rutas "/project", "/project/:id". Metodo GET obtencion de informacion', () => {
            it('Ruta "/project". Deberia responder con status 200 y retornar un array con todos los proyectos.', async () => {
                const response = await agent
                    .get('/api/project')
                    .expect(200);
                expect(response.body).toEqual(page.resGetPage);
            })
            it('Ruta "/project/:id". Deberia responder con status 200 y retornar la informacion del proyecto mas los items correspondientes', async () => {
                const id = 1
                const response = await agent
                    .get(`/api/project/${id}`)
                    .expect(200);
                expect(response.body).toEqual(page.resDetailPage);
            })
            it('Deberia responder con status 400 y retornar un error si el id no fuera un numero', async () => {
                const id = '1.5abd'
                const response = await agent
                    .get(`/api/project/${id}`)
                    .expect(400);
                expect(response.body).toEqual({ error: 'Parámetros no permitidos' })
            })
        })
        describe('Rutas "/project/:id". Metodo PUT actualizacion de proyecto', () => {
            it('Deberia responder con un status 200 y actualizar el proyecto', async() => {
                const id = 1
                const newData = page.bodyUpd;
                const response = await agent
                    .put(`/api/project/${id}`)
                    .send(newData)
                    .expect(200);
                expect(response.body).toMatchObject(page.bodyUpdResponse)
            })
            it('Deberia responder con status 400 y un mensaje de error si faltan parametros', async()=>{
                const id = 1
                const newData = page.wrongBody;
                const response = await agent
                    .put(`/api/project/${id}`)
                    .send(newData)
                    .expect(400);
                expect(response.body).toEqual({error: 'missing parameter'})
            })
        })
        describe('Rutas "/project/:id". Metodo PATCH actualizacion de item', () => {
                it('Deberia responder con status 200 y actualizar el item', async()=>{
                    const id=1
                    const body = page.itemUpdate
                    const response = await agent
                    .patch(`/api/project/${id}`)
                    .send(body)
                    .expect(200)
                    expect(response.body).toMatchObject(page.responseItemUpdate)
                })
                it('Deberia responder con status 400 y retornar un mensaje de error si faltan parametros', async()=>{
                    const id= 1
                    const body = page.wrongItem
                    const response = await agent
                    .patch(`/api/project/${id}`)
                    .send(body)
                    .expect(400)
                    expect(response.body).toEqual({error: "Missing fields: text, enable"})
                })
        })
        describe('Ruta "/api/project/id". Metodo DELETE. Eliminar proyecto e items', ()=>{
            it('Deberia responder con status 200 y un mensaje de eliminacion exitosa', async()=>{
                const id= 1
                const body = help.itemUpdate
                const response = await agent
                .delete(`/api/project/${id}`)
                .expect(200)
                expect(response.body).toMatchObject({ message: 'Page and associated items deleted successfully' })
            })
        })
    })
});