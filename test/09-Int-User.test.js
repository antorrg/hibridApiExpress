import {createMock, admin, setTokens} from './helperTest/jwtHelper.js'
import * as store from './helperTest/testStore.js'
import app from '../server/app.js'
import session from 'supertest-session'
const agent = session(app);
import * as help from './helperTest/06-helpData.js'



describe('Test de rutas REST:  Usuario', () => {
  
    describe('Test de rutas de usuario: "/api/v1/user": ', () => {
        describe('Ruta "user/login": Ruta POST de validacion de usuario', () => {
            it('Deberia responder con status 200 y retornar el usuario con el token', async () => {
                // Creacion de usuario:
                const user = await createMock(admin)
                //console.log('Response create: ',user)
                const email = "josenomeacuerdo@hotmail.com";
                const password = 'L1234567'
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(response.body.user).toMatchObject(help.userLogged)
                store.setToken(response.body.token)
                store.setUserId(response.body.user.id)
                
            })
            it('Deberia responder con status 400 si faltan parametros', async () => {
                const email = "josenomeacuerdo@hotmail.com";
                const password = ''
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(400);
                expect(response.body.error).toBe("Invalid password. It must be at least 8 characters long and one uppercase letter.")
            })
        });
        describe('Ruta "user/create": Ruta POST de creacion de usuario', () => {
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
                store.setUserId2(response.body.results.id)
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
                expect(response.body.error).toBe("Invalid parameters")
            })
        })
      
        describe('Rutas "/user", "/user/:id: Rutas GET protegidas por token', () => {
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
                expect(response.body.error).toBe('Acceso no autorizado. Token no proporcionado');
            })
            it('Ruta "/user/:id": Deberia responder con status 200 y retornar un usuario', async () => {
                const token = store.getToken();
                const userId = store.getUserId2()
                const response = await agent
                    .get(`/api/v1/user/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toMatchObject(help.respGetById);
            })
            it('Deberia arrojar un error 401 si el token no fuera el correcto', async () => {
                const userId = store.getUserId2()
                const response = await agent
                    .get(`/api/v1/user/${userId}`)
                    .set('Authorization', `Bearer 'eyW9yb2RyaWd1ZXp0a2RAZ21haWwuY29tIiwicmeHAiOjE3MTk2OTI3MjZ9.7Onxx2MjQdeJF-KccG'`)
                    .expect(401);
                expect(response.body.error).toBe('Token invalido' );
            })
        })
        describe('Ruta "/user/profile/:id" Ruta PUT de actualizacion de perfil de usuario (ruta protegida con token).', () => {
            it('Deberia recibir un status 200 al actualizar un usuario con exito', async () => {
                const userId = store.getUserId();
                const newData = help.newUser;
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/profile/${userId}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body).toMatchObject(help.updatedUser)
            })
            it('Deberia arrojar un status 400 si faltaran parametros', async () => {
                const userId = store.getUserId();
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/profile/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.error).toBe('Invalid parameters' )
            })
        })
        describe('Ruta "/user/verify" de verificacion de password', () => {
            it('Deberia retornar un status 200 y un mensaje de verificacion aprobada', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/v1/user/verify`)
                    .send({ id, password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toBe("Verify succesfully" )
                
            })
            it('Deberia retornar un status 401 y un mensaje de error por falta de validacion.', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/v1/user/verify`)
                    .send({ id, password })
                    .expect(401);
                expect(response.body.error).toBe('Acceso no autorizado. Token no proporcionado' )
            })
            it('Deberia retornar un status 400 y un mensaje de error si el usuario no es propietario de la cuenta.', async () => {
                const id = store.getUserId2();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/v1/user/verify`)
                    .send({ id, password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.error).toBe("Solo el propietario puede ejecutar esta acción")
            });
        });
        describe('Ruta "/user/update" de actualizacion de password', () => {
            it('Deberia retornar un status 200 y un mensaje de actualizacion realizada', async () => {
                const id = store.getUserId();
                const password = 'D12345678';
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/update/${id}`)
                    .send({password})
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toBe("Update password successfully" )
                
            });
            it('Deberia retornar un status 401 y un mensaje de error por falta de validacion.', async () => {
                const id = store.getUserId();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/v1/user/verify`)
                    .send({ id, password })
                    .expect(401);
                expect(response.body.error).toBe('Acceso no autorizado. Token no proporcionado' )
            });
            it('Deberia retornar un status 400 y un mensaje de error si el usuario no es propietario de la cuenta.', async () => {
                const id = store.getUserId2();
                const password = 'L1234567';
                const token = store.getToken()
                const response = await agent
                    .post(`/api/v1/user/verify`)
                    .send({ id, password })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.error).toBe("Solo el propietario puede ejecutar esta acción")
            });
            it('Deberia responder con status 200 al hacer login con el nuevo password', async () => {
            
                const email = "josenomeacuerdo@hotmail.com";
                const password = 'D12345678'
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(response.body.user).toMatchObject(help.newUserLogged)
            });
        });
        describe('Ruta "/user/reset" de blanqueo (reset) de password', () => {
            it('Deberia retornar un status 200 y un mensaje de actualizacion realizada', async () => {
                const id = store.getUserId();
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/reset/${id}`)
                    .send({})
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toEqual("Reset password successfully" )
                
            });
            it('Deberia retornar un status 401 y un mensaje de error por falta de validacion.', async () => {
                const id = store.getUserId();
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/reset/${id}`)
                    .send({})
                    .expect(401);
                expect(response.body).toEqual({ error: 'Acceso no autorizado. Token no proporcionado' })
            });
            it('Deberia responder con status 200 al hacer login con el nuevo password', async () => {
            
                const email = "josenomeacuerdo@hotmail.com";
                const password = 'L1234567'
                const response = await agent
                    .post('/api/v1/user/login')
                    .send({ email, password })
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(response.body.user).toMatchObject(help.newUserLogged)
            });
        })
        describe('Ruta "/user/upgrade/:id" de actualizacion de roles y bloqueo/desbloqueo de usuario', () => {
            it('Cambio de rol. Deberia retornar un status 200 y un mensaje de actualizacion exitosa', async () => {
                const id = store.getUserId2();
                const role = 9
                const enable = true
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/upgrade/${id}`)
                    .send({ role , enable})
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toBe("Upgrade successfully")
            })
            it('Bloqueo de usuario. Deberia retornar un status 200 y un mensaje de actualizacion exitosa', async () => {
                const id = store.getUserId2();
                const enable= false
                const role = 9
                const token = store.getToken()
                const response = await agent
                    .put(`/api/v1/user/upgrade/${id}`)
                    .send({ role, enable })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toBe("Upgrade successfully")
            })
            it('Deberia retornar un status 401 y un mensaje error por token invalido', async () => {
                const id = store.getUserId2();
                const enable= false
                const role = 9
                const token = 'asoifasdofisadoifasdoifjsoadfi'
                const response = await agent
                    .put(`/api/v1/user/upgrade/${id}`)
                    .send({ role, enable })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(401);
                expect(response.body).toEqual({ error: 'Token invalido' })
            })
        })
        describe('Ruta "/user/:id" de eliminacion de usuario', () => {
            it('Deberia retornar un status 200 y un mensaje de borrado exitoso', async () => {
                const id = store.getUserId2();
                const token = store.getToken()
                const response = await agent
                    .delete(`/api/v1/user/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.message).toBe("User deleted successfully")
            })
        })
    });
});