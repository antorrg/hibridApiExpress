import session from 'express-session';
import { Sequelize } from 'sequelize';
import connectSessionSequelize from 'connect-session-sequelize';
import crypto from 'crypto'
import pkg from 'jsonwebtoken'
import env from '../envConfig.js';
import * as eh from '../errorHandler.js'


const SequelizeStore = connectSessionSequelize(session.Store);

// Inicializa Sequelize con tu configuración de PostgreSQL
const sequelize = new Sequelize(env. dbConnect, {
    dialect: 'postgres',
    logging: false,
});

// Crea el almacén de sesiones
export const myStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions', // Nombre de la tabla donde se guardarán las sesiones
    checkExpirationInterval: 10 * 60 * 1000, // Intervalo en milisegundos para eliminar las sesiones expiradas
    expiration: 24 * 60 * 60 * 1000 // Tiempo en milisegundos después del cual las sesiones expiran
});

// Sincroniza el modelo de sesiones con la base de datos
myStore.sync();
const test = (env.Status==='test')? true : false
//console.log('Estoy probando a test en sesion', test)
// Configura el middleware de sesión
export const sessionMiddle = session({
    secret: env.SecretKey,
    resave: test,
    saveUninitialized: false,
    store: myStore,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // Tiempo de vida de la cookie en milisegundos
    }
});

// Manejo de errores
myStore.on('error', (error) => {
    console.error(error);
});


//! Esta parte corresponde a jsonwebtoken: 


//Estas funciones no se exportan porque intervienen en la confeccion de jsonwebtoken
const disguiseRole = (role, position)=>{
    //Generar cadena aleatoria de 20 caracteres
    const generateSecret = () => {
    return crypto.randomBytes(10).toString('hex')};

    const str = generateSecret()
    if (position < 0 || position >= str.length) {
        throw new Error('Posición fuera de los límites de la cadena')}
        // Convertir el número a string
        const replacementStr = role.toString();
        // Crear la nueva cadena con el reemplazo
        return str.slice(0, position) + replacementStr + str.slice(position + 1);
}
        
const recoveryRole = (str, position)=>{
    if (position < 0 || position >= str.length) {
    throw new Error('Posición fuera de los límites de la cadena')}
    // Recuperar el carácter en la posición especificada
    const recover = str.charAt(position);
    return parseInt(recover)
}

//En recoveryRole str es el dato entrante (string)


export const generateToken = (user, session)=>{
        const intData = disguiseRole(user.role, 5)
        const expiresIn = Math.ceil(session.cookie.maxAge / 1000); // Obtener el tiempo de expiración en segundos
        //console.log('estoy en el token: ', expiresIn)
        const token = pkg.sign({userId: user.id, email:user.email, internalData:intData}, env.SecretKey, {expiresIn});
        return token;
    };
export const verifyToken = (req, res, next)=>{
     let token = req.headers['x-access-token'] || req.headers.authorization;
            if(!token){return next(eh.middError('Acceso no autorizado. Token no proporcionado', 401))}
            if (token.startsWith('Bearer')) {
            // Eliminar el prefijo 'Bearer ' del token
            token = token.slice(7, token.length);
              }
             // console.log('Session en verify:', req.session.user);
              //console.log('SessionToken en verify:', req.session.user.token)
            if (!req.session.user|| !req.session.user.token) {return next(eh.middError('Sesion o token invalidos', 401))}
            pkg.verify(token, env.SecretKey, (err, decoded)=>{
            if(err){
                if(err.name === 'TokenExpiredError'){return next(eh.middError('Token expirado', 401))
                }return next(eh.middError('Token invalido', 401))
            }
            req.user = decoded;
            const userId = decoded.userId;
            const userRole= recoveryRole(decoded.internalData, 5);
            req.userInfo = {userId, userRole}
            //console.log('soy userinfo: ', req.userInfo)
            //console.log('userInfo: ', req.user.userId, )
            //console.log('soy role : ', userRole)
            next();

        })
       
    };
export const checkRole = (allowedRoles) => {
        return (req, res, next) => {
          
          //const userRole = req.user.role; // asumiendo que el rol está en req.user después de la autenticación
      
          if (allowedRoles.includes(userRole)) {
            // El usuario tiene el rol necesario, permitir el acceso
            next();
          } else {
            // El usuario no tiene el rol necesario, rechazar la solicitud
           return next(eh.middError('Acceso no autorizado', 403))
          }
        };
      };

//Este es un modelo de como recibe el parámetro checkRole:
  //todo   app.get('/ruta-protegida', checkRole(['admin']), (req, res) => {
