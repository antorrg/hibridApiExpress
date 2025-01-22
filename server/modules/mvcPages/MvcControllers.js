import { renderError } from '../../errorHandler.js'
import land from '../landingPage/landControllerService.js'
import product from '../productItems/controllerService.js'
import env from '../../envConfig.js'



const prodGetAll = product.getProdMvc;
const prodGetById = product.getProdByIdMvc;
const prodGetItem = product.getItemMvc;
const landing = land.landServGetAll;
const appPath = env.Status==='production'? "/" : "http://localhost:5173/"

const uriWhatsApp=`https://wa.me/${env.WhatsAppNumber}?text=${encodeURIComponent(env.WhatsAppMessage)}`

let metaStored = '';
const setStored = (data)=>{metaStored = data;}
const getStored = ()=>{return metaStored}

export default {
   
   getLanding : renderError(async(req, res)=>{
      const response = await landing()
      const products = await prodGetAll()
      const admin = req.session && req.session.isAuthenticated ? true : false;
      //console.log('permisos en el admin: ',admin)
      //console.log('soy response', products )
      res.render('landing', {url: appPath, landing:response.data[0], info: products.data, meta: response.data[0].info_header, isAuthenticated:admin})
   }),

   getProduct : renderError(async(req, res)=>{
      const getInfo = await prodGetAll()
      const response = getInfo.data;
      //console.log(response)
      res.render('products', {url: appPath, info: response, meta: response[0].info_header, isAuthenticated: req.session.isAuthenticated})
   }),

   getDetails : renderError(async(req, res)=>{
      const {id} = req.params;
      const getInfo = await prodGetById(id)
      const response = getInfo;
      //console.log(response)
      setStored(response.info.info_header)
      res.render('details', {url: appPath, info: response.info, items:response.items, meta: getStored(), isAuthenticated: req.session.isAuthenticated})
   }),

   getItems : renderError(async(req, res)=>{
      const {id} = req.params;
      const response = await prodGetItem(id)
      //console.log(response)
      res.render('item', {url: appPath, item: response, meta: getStored(), isAuthenticated: req.session.isAuthenticated})
   }),

   getContact : renderError(async(req, res)=>{
      res.render('contact',{url: appPath, uriWhatsApp})
   }),

   getAbout: renderError(async(req, res)=>{
    res.render('about', {url: appPath, })
   }),

   getReact: renderError(async(req, res)=>{
    res.render('index')
   }),
}
