import { renderError } from '../../errorHandler.js'
import {landService} from '../landingPage/landControllerService.js'
import help from '../../helpers/generalHelp.js'; // dataEmptyLanding, cleanerLanding
import env from '../../envConfig.js'



const prd = serv.productService;
const land = landService;
const appPath = env.Status==='production'? "/form" : "http://localhost:5173/"


export default {
   
   getLanding : renderError(async(req, res)=>{
      const response = await land.getAll(help.cleanerLanding, null, help.dataEmptyLanding)
    res.render('landing', {url: appPath, landing: response, isAuthenticated: null})
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
