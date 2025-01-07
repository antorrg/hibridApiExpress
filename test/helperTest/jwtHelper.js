import UserService from '../../server/Classes/userService.js';
import {User} from '../../server/database.js'
import * as store from './testStore.js'
import authServer from './05-jwtServerTest.js'
import session from 'supertest'
const agent = session(authServer);

//todo Las funciones exportadas son: createMock y admin para Int-User, y setTokens para el resto.

//* Por causa de los métodos de creación (con usuario preexistente) el usuario debe crearse antes.

const userMock = new UserService(User, false, false, null )//constructor(Model, useCache, useImage, deleteImages) 

export const admin = {email:'josenomeacuerdo@hotmail.com', password:'L1234567', role: 9, picture: 'url'}

const user = {email:'juangarcia@gmail.com', password:'L1234567', role: 1, picture: 'url'}

export const createMock = async(data)=>{
    const result = await userMock.create(data, 'email', false)
    return result;
}

// store.setToken(token)
// store.setUserToken(token)

const login = async (data) => {
    const response = await agent.post('/test/auth/login').send(data); // Cambia la ruta según tu API
    if (response.status === 200 && response.body.token) {
        return response.body.token;
    } else {
        throw new Error(`Login fallido para el usuario ${data.email}: ${response.status}`);
    }
};
export const setTokens = async () => {
    try {
        // Crear los usuarios si no existen
        await Promise.all([createMock(admin), createMock(user)]);

        // Iniciar sesión y almacenar los tokens
        const [adminToken, userToken] = await Promise.all([
            login(admin),
            login(user)
        ]);

        // Guardar los tokens en el almacenamiento de pruebas
        store.setToken(adminToken); // Asume que esto guarda el token admin
        store.setUserToken(userToken); // Asume que esto guarda el token user
    } catch (error) {
        console.error('Error al configurar los tokens:', error);
        throw error;
    }
};

