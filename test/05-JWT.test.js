import authServer from './helperTest/05-jwtServerTest.js'
import session from 'supertest-session'
const agent = session(authServer)
import * as store from './helperTest/testStore.js'


describe('Tests de middlewares',()=>{
    // afterAll(()=>{
    //     console.log('Finalizando todas las pruebas...')
     
    // })
    describe('Funciones "generateToken" y "verifyToken" (jsonwebtoken) combinadas con express-session', ()=>{
        it('Deberia iniciar sesion y enviar la cookie y un token', async()=>{
            const user = { email: 'josenomeacuerdo@nose.com', password: '', role: 1}
            const response = await agent
             .post('/test/auth/login')
             .send(user)
             .expect('Content-Type', /json/)
             .expect(200);
             expect(response.body).toHaveProperty('token');
             expect(response.body).toHaveProperty('user');
             expect(response.body.user.email).toBe('josenomeacuerdo@nose.com');
             store.setUserId(response.body.user.id)
            store.setToken(response.body.token)
            // Verificar que la cookie está configurada
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some((cookie) => cookie.startsWith('sessionId='))).toBe(true);     
        })
        it('Deberia permitir el paso si está presente el token', async()=>{
            const token = store.getToken()
            const response = await agent
             .get('/test/auth')
             .set('Authorization', `Bearer ${token}`)
             .expect('Content-Type', /json/)
             .expect(200);
             expect(response.body).toEqual({ message: 'Passed middleware' })       
        })
        it('Deberia negar el paso si no está presente el token o este no es valido', async()=>{
            const response = await agent
             .get('/test/auth')
             .set('Authorization', `Bearer pepito`)
             .expect('Content-Type', /json/)
             .expect(401);
             expect(response.body.message).toEqual("Token invalido")       
        })
       
        it('Deberia decodificar el id y el role del usuario en un objeto: "req.UserInfo"', async()=>{
            const token = store.getToken()
            const compare = { userId: "c1d970cf-9bb6-4848-aa76-191f905a2edd", userRole: 1}
            const response = await agent
             .get('/test/auth/response')
             .set('Authorization', `Bearer ${token}`)
             .expect(200);
             expect(response.body).toEqual(compare)    
        })
        xit('Deberia cerrar sesion y no permitir el acceso con token despues.', async() => {
            await agent
            .post('/test/logout')
            const token = store.getToken()
            const response = await agent
             .get('/test/auth')
             .set('Authorization', `Bearer ${token}`)
             .expect(401);
             expect(response.body.message).toEqual('Sesion o token invalidos')  
        })
    })
})
