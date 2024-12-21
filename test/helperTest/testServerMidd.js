import express from 'express'
import {catchController} from '../../server/errorHandler.js'
import { GenericMidd, ProductMidd } from '../../server/Classes/GenericMiddleware.js';

const genericmidd = new GenericMidd(['title','description', 'picture'])
// Methods: validateFields, validateUUID, validateINT,  validateNumbers, validateFieldContent
const validCreateFields = genericmidd.validateFields()
const validUpdateFields = genericmidd.validateFields(['title', 'description', 'picture', 'enable', 'useImg'])
const validUUid = genericmidd.validateUUID('userId')
const validInteger = genericmidd.validateINT('productId')
const validFieldBody = genericmidd.validateNumbers('price')
const regexValidEmail = genericmidd.validateFieldContent('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')//(fieldName, fieldRegex, errorMessage)

//* ProductMidd:

const productMidd = new ProductMidd(['title','description',], ['img', 'text'])

const createProd = productMidd.validateFieldsWithItems()
const updateProd = productMidd.validateFieldsWithItems(['title','description', 'enable', 'saver'], ['img', 'text', 'enable'])

const serverMidd = express()
serverMidd.use(express.json())

serverMidd.post('/test/land/create',  validCreateFields, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

serverMidd.get('/test/users/:userId', validUUid, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

serverMidd.get('/test/land/:productId', validInteger, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

serverMidd.put('/test/land/:id', validUpdateFields, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})


serverMidd.put('/test/product/:id', validFieldBody, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

serverMidd.post('/test/users', regexValidEmail, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

//! ProductMidd:
serverMidd.post('/test/product/create', createProd, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})

serverMidd.put('/test/product/create/:id', updateProd, (req, res) => {
    res.status(200).json({ message: 'Passed middleware' })})



serverMidd.use((err, req, res, next) => {
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
export default serverMidd;