import { body, query, header, validationResult } from 'express-validator';
import { middError } from '../errorHandler';

export default {
  sanitizeBody: [
    body('*').trim().escape(), // Sanea todos los campos del cuerpo de la solicitud, excepto 'imagenUrl'
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(middError('Error filtering body',400 ));
      }
      next();
    }
  ],

sanitizeQuery : [
  query('*').trim().escape(), // Sanea todos los parámetros de consulta
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(middError('Error filtering query', 400));
    }
    next();
  }
],

 sanitizeHeaders : [
  header('Authorization').trim().escape(), // Sanea el header de Authorization
  header('Content-Type').isIn(['application/json']).withMessage('Invalid Content-Type'), // Valida el Content-Type
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(middError('Error filtering Headers', 400));
    }
    next();
  }
],

}
