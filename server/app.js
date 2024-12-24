import express from 'express'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import cors from 'cors'
import getAssetPath from './utils/assetsConfig.js'
import cookieParser from 'cookie-parser'
import {sessionMiddle} from './utils/authConfig.js'
import env from './envConfig.js'
import mainRouter from './routers/router.js'


//cambio de carpetas para dev y production (views y statics)

const viewPath = env.Status === 'development' 
  ? path.resolve('views') 
  : path.resolve('dist/views');

const staticPath = env.Status === 'development' 
? path.resolve('src') 
: path.resolve('dist/assets');

const app = express()
//setear automatizacion en el build para pug


app.locals.getAssetPath = getAssetPath;
app.use(cookieParser())
app.use(sessionMiddle)

app.use(morgan('dev'))
app.use(cors())
app.set('view engine', 'pug')
app.set('views', viewPath)

app.use(express.static(staticPath))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Rutas para API y React en `/home`
app.use(mainRouter) 

 app.use((req, res, next)=>{
    res.render('error', { message: 'Not Found', status: 404});
  });

// Manejador de errores
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error';
    console.error('Error: ', err);
    //res.render('error', { message: message, status: status});
    res.status(status).json({
      success: false,
      data: null,
      message,
  });
});

export default app;