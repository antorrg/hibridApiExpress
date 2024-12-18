import express from 'express'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import cors from 'cors'
import env from './envConfig.js'
import mainRouter from './routers/router.js'




//cambio de carpetas para dev y production (views y statics)
const rootDir = path.resolve()

const viewPath = env.Status === 'development' 
  ? path.join(rootDir, 'views') 
  : path.join(rootDir, 'dist/views');

const staticPath = env.Status === 'development' 
? path.join(rootDir, 'src') 
: path.join(rootDir, 'dist/assets');

const app = express()
//probar automatizacion en el build para pug

let manifest;
if (env.Status === 'production') {
  const manifestPath = path.resolve('dist/.vite/manifest.json');
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

app.locals.getAssetPath = (assetName) => {
  if (env.Status === 'production') {
    // Verificamos si el assetName existe en el manifiesto
    const key = `src/files/${assetName}`; // Asegúrate de que esta clave coincida con la del manifiesto
    if (manifest[key]) {
        //console.log(assetName)
        //return `/${manifest[key].file}`; // Retorna la ruta generada en dist
        return `/${assetName}`
    }
    console.warn(`Asset "${assetName}" no encontrado en el manifest.`);
    return assetName; // Fallback si no se encuentra el asset
  }
  console.log(assetName)
  return `/files/${assetName}`; // Ruta en desarrollo
};

app.use(morgan('dev'))
app.use(cors())
app.set('view engine', 'pug')
app.set('views', viewPath)

app.use(express.static(staticPath))

app.use(express.json())

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