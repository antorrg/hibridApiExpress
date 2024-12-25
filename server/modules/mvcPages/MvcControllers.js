import { renderError } from '../../errorHandler.js'
import land from '../landingPage/landControllerService.js'
import product from '../productItems/controllerService.js'
import env from '../../envConfig.js'



const prodGetAll = product.getProdMvc;
const prodGetById = product.getProdByIdMvc;
const prodGetItem = product.getItemMvc;
const landing = land.landServGetAll;
const appPath = env.Status==='production'? "/form" : "http://localhost:5173/"


export default {
   
   getLanding : renderError(async(req, res)=>{
      const response = await landing()
      //console.log('soy response', response.data[0])
    res.render('landing', {url: appPath, landing:response.data[0], meta: response.data[0].info_header, isAuthenticated: null})
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
