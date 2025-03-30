/**
 * Router principal de la aplicación.
 * @module router
 */
import express from 'express'
import * as img from './utils/uploaderImgs.js'
import mvcRouter from './modules/mvcPages/mvcRouters.js';
import landRouter from './modules/landingPage/landRouter.js'
import productRouter from './modules/productItems/productRoutes.js'
import userRouter from './modules/users/userRouter.js'
import contactRouter from './modules/contacts/contacRouter.js';
import sanit from './utils/expressValidator.js'
import {verifyToken} from './utils/authConfig.js'


const mainRouter = express.Router()

//mainRouter.use(sanit.sanitizeHeaders)
//mainRouter.use(sanit.sanitizeBody)
//mainRouter.use(sanit.sanitizeQuery)

mainRouter.use(mvcRouter)

mainRouter.use('/api/v1', userRouter)

mainRouter.use("/api/v1/", contactRouter)

mainRouter.post('/api/v1/uploadImage', verifyToken, img.uploadMiddleware, img.imageUploader )

mainRouter.use('/api/v1',  verifyToken, landRouter)

mainRouter.use('/api/v1', verifyToken, productRouter)


// Manejador de Rutas No Encontradas para MVC
mainRouter.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/v1/')) {
      // Si es una ruta de la API, pasa al siguiente middleware
      return next();
    }
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // Manejador de Errores para MVC
  mainRouter.use((err, req, res, next) => {
    if (req.originalUrl.startsWith('/api/v1/')) {
      // Si es una ruta de la API, pasa al siguiente middleware
      return next(err);
    }
    res.status(err.status || 400);
    res.render('error', { message: err.message, status: err.status || 500 });
  });
  
  // Manejador de Rutas No Encontradas para API REST
  mainRouter.use('/api/v1/*', (req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
  });
  
  // Manejador de Errores para API REST
  mainRouter.use('/api/v1/*', (err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
  });
  



export default mainRouter; 
