import express from 'express'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import getAssetPath from './utils/assetsConfig.js'
import cookieParser from 'cookie-parser'
import {sessionMiddle, checkAuthentication} from './utils/authConfig.js'
//import swaggerUi from "swagger-ui-express"
//import swaggerJsDoc from "swagger-jsdoc"
//import swaggerOptions from "../swaggerDocs/swaggerOptions.js";
import env from './envConfig.js'
import mainRouter from './router.js'


//cambio de carpetas para dev y production (views y statics)

const viewPath = env.Status === 'production' 
  ? path.resolve('dist/views')
  : path.resolve('views');
  const staticPath = env.Status === 'production' 
  ? path.resolve('dist/assets')
  : path.resolve('src');
//Swagger:
//const swaggerDocs = swaggerJsDoc(swaggerOptions)
/*const swaggerUiOptions = {
  swaggerOptions: {
    docExpansion: "none", // 👈 Oculta todas las rutas al cargar
  },
};*/

const app = express()
//setear automatizacion en el build para pug

app.locals.getAssetPath = getAssetPath;
app.use(cookieParser())
app.use(sessionMiddle)


if (env.Status !== 'test') {
app.use(morgan('dev'))}

app.use(cors())

app.set('view engine', 'pug')
app.set('views', viewPath)

app.use(express.static(staticPath))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(checkAuthentication);

/*if(env.Status === 'development'){
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions))
}*/
// Rutas para API y React en `/home`
app.use(mainRouter) 


 app.use('*',(req, res, next)=>{
    res.status(404).json( { message: 'Not Found', status: 404});
  });

// Manejador de errores
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error';
    if(env.Status==='development'){
    console.error('Error: ', err);}
    res.status(status).json({
      success: false,
      data: null,
      message,
  });
});

export default app;