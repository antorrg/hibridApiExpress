import { renderError, catchController } from '../errorHandler.js'
import serv from './index.js'
import env from '../envConfig.js'



const prd = serv.productService;
const land = serv.landingService;
const appPath = env.Status==='production'? "/form" : "http://localhost:5173/"


export default {
   
   probarMiddlewares : catchController(async(req, res)=>{
     
      return res.status(200).json('passed middleware')
   }), 
   
   getLanding : renderError(async(req, res)=>{
    res.render('landing', {url: appPath})
   }),

   getProduct : renderError(async(req, res)=>{}),

   getDetails : renderError(async(req, res)=>{}),

   getItems : renderError(async(req, res)=>{}),

   getContact : renderError(async(req, res)=>{}),

   getAbout: renderError(async(req, res)=>{
    res.render('about', {url: appPath})
   }),

   getReact: renderError(async(req, res)=>{
    res.render('index')
   }),
}
