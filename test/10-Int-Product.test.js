import {setTokens} from './helperTest/jwtHelper.js'
import * as store from './helperTest/testStore.js'
import app from '../server/app.js'
import session from 'supertest-session'
const agent = session(app);
import * as prod from './helperTest/genericHelp.js'


describe('Test de rutas REST: Project', () => {
   
    describe('Test de rutas Product: "/api/v1/product": CRUD basico completo:', () => {
        describe('Rutas "/product/create", "/item/create", Creacion de proyecto e item.', () => {
           
            it('Deberia crear un proyecto con algunos items (más de uno)', async () => {
                await setTokens()
                const token = store.getToken()
                const response = await agent
                    .post('/api/v1/product/create')
                    .send(prod.product)
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body.results).toBe("Product created successfully")
            })
            it('Ruta "/item/create". Deberia crear un item individualmente', async () => {
                const id = 1; //El id de page para relacionar
                const img = "img";
                const text = "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el."
                const token = store.getToken()
                const response = await agent
                    .post('/api/v1/item/create')
                    .send({ id, img, text })
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body.results).toBe("Item created successfully")
            })
        })
        describe('Rutas "/product", "/product/:id". Metodo GET obtencion de informacion', () => {
            it('Ruta "/product". Deberia responder con status 200 y retornar un array con todos los productos.', async () => {
                const token = store.getToken()
                const response = await agent
                    .get('/api/v1/product')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toEqual(prod.genralProductResponse);
            })
            it('Ruta "/product/:id". Deberia responder con status 200 y retornar la informacion del proyecto mas los items correspondientes', async () => {
                const token = store.getToken()
                const id = 1
                const response = await agent
                    .get(`/api/v1/product/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toEqual(prod.productResponse);
            })
            it('Ruta "/item/:id". Deberia responder con status 200 y retornar la informacion de un item', async () => {
                const token = store.getToken()
                const id = 1
                const response = await agent
                    .get(`/api/v1/item/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toEqual(prod.itemResponse);
            })
            it('Deberia responder con status 400 y retornar un error si el id no fuera un numero', async () => {
                const token = store.getToken()
                const id = '1.5abd'
                const response = await agent
                    .get(`/api/v1/product/${id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.message).toBe("Parametros no permitidos" )
            })
        })
        describe('Rutas "/product/:id". Metodo PUT actualizacion de producto', () => {
            it('Deberia responder con un status 200 y actualizar el producto', async() => {
                const token = store.getToken()
                const id = 1
                const newData = prod.bodyUpdate;
                const response = await agent
                    .put(`/api/v1/product/${id}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200);
                expect(response.body.results).toMatchObject(prod.productUpdated)
            })
            it('Deberia responder con status 400 y un mensaje de error si faltan parametros', async()=>{
                const token = store.getToken()
                const id = 1
                const newData = prod.wrongBodyUpdate;
                const response = await agent
                    .put(`/api/v1/product/${id}`)
                    .send(newData)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400);
                expect(response.body.message).toBe("Missing parameters: enable")
            })
        })
        describe('Rutas "/item/:id". Metodo PUT actualizacion de item', () => {
                it('Deberia responder con status 200 y actualizar el item', async()=>{
                    const token = store.getToken()
                    const id=1
                    const body = prod.itemForUpdated
                    const response = await agent
                    .put(`/api/v1/item/${id}`)
                    .send(body)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)
                    expect(response.body.results).toMatchObject(prod.itemUpdated)
                })
                it('Deberia responder con status 400 y retornar un mensaje de error si faltan parametros', async()=>{
                    const token = store.getToken()
                    const id= 1
                    const body = prod.wrongItemUpdate
                    const response = await agent
                    .put(`/api/v1/item/${id}`)
                    .send(body)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400)
                    expect(response.body.message).toBe("Missing parameters: text, enable")
                })
        })
        describe('Ruta "/api/project/id". Metodo DELETE. Eliminar proyecto e items', ()=>{
            it('Borrado de 1 item: Deberia responder con status 200 y un mensaje de eliminacion exitosa', async()=>{
                const token = store.getToken()
                const id= 1
                const response = await agent
                .delete(`/api/v1/item/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                expect(response.body.message).toBe('Item deleted successfully' )
            })
            it('Borrado de producto y sus items: Deberia responder con status 200 y un mensaje de eliminacion exitosa', async()=>{
                const token = store.getToken()
                const id= 1
                const response = await agent
                .delete(`/api/v1/product/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                expect(response.body.results).toBe("Product and items asociated deleted successfully")
            })
        })
    })
})
