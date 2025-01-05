import { body, query, header, validationResult } from 'express-validator';
import { middError } from '../errorHandler.js';

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
  sanitizeProduct: [
    // Sanea campos específicos que son cadenas
    body('uniqueField').trim().escape(),
    body('title').trim().escape(),
    body('landing').trim().escape(),
    body('logo').trim().escape(),
    body('info_header').trim().escape(),
    body('info_body').trim().escape(),
    body('url').trim().escape(),

    // Sanea los campos internos de "items" si es un array
    body('items').customSanitizer((items) => {
        // Verificar si 'items' es un array y luego mapear cada elemento
        if (Array.isArray(items)) {
            return items.map((item, index) => {
                // Verificar si 'item' tiene las propiedades 'img' y 'text'
                console.log(`Item ${index}:`, item);  // Depurar el item en el log
                const sanitizedItem = {};
                
                // Sanitizar los campos 'img' y 'text' si son cadenas de texto
                if (typeof item.img === 'string') {
                    sanitizedItem.img = item.img.trim().escape();
                } else {
                    sanitizedItem.img = item.img;  // Mantenerlo tal cual si no es una cadena
                }

                if (typeof item.text === 'string') {
                    sanitizedItem.text = item.text.trim().escape();
                } else {
                    sanitizedItem.text = item.text;  // Mantenerlo tal cual si no es una cadena
                }

                return sanitizedItem;  // Retornar el objeto sanitizado
            });
        }
        return items;  // Si no es un array, retornamos los datos tal cual
    }),

    // Manejo de errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(middError('Error filtering body', 400));
        }
        next();
    },
],
sanitizeMultipartHeaders : [
  // Sanitizar y validar la cabecera Authorization
  header('Authorization')
    .notEmpty().withMessage('Authorization header is required')
    .trim()
    .escape(),

  // Validar que el Content-Type sea multipart/form-data
  header('Content-Type')
    .custom((value) => {
      if (!value || !value.startsWith('multipart/form-data')) {
        throw new Error('Invalid Content-Type, expected multipart/form-data');
      }
      return true;
    }),

  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(middError(`Header validation error: ${errors.array().map(err => err.msg).join(', ')}`, 400));
    }
    next();
  }
],
sanitizeProduct2: [
  // Sanea campos específicos que son cadenas
  body('uniqueField').trim().escape(),
  body('title').trim().escape(),
  body('landing').trim().escape(),
  body('logo').trim().escape(),
  body('info_header').trim().escape(),
  body('info_body').trim().escape(),
  body('url').trim().escape(),

  // Sanea los campos internos de "items" si es un array
   // Sanea los campos internos de "items" si es un array
   body('items').customSanitizer((items) => {
    if (Array.isArray(items)) {
        // Usamos un bucle for para iterar y sanitizar manualmente cada objeto
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            // Sanitizar 'img' solo si es una cadena
            if (item.img && typeof item.img === 'string') {
                item.img = item.img.trim().escape();
            }

            // Sanitizar 'text' solo si es una cadena
            if (item.text && typeof item.text === 'string') {
                item.text = item.text.trim().escape();
            }
        }
    }
    return items;  // Si no es un array, retornamos tal cual
}),

  // Manejo de errores de validación
  (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return next(middError('Error filtering body', 400));
      }
      next();
  },
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


sanitizeHeaders2 : [
  // Valida y sanea la cabecera 'Authorization'
  header('Authorization')
    .trim()
    .escape()
    .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/) // Validación básica de JWT (opcional)
    .withMessage('Invalid Authorization format'),

  // Valida el 'Content-Type'
  header('Content-Type')
    .isIn(['application/json'])
    .withMessage('Invalid Content-Type'),

  // Manejo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Proporcionar más contexto en el error
      return next(middError(`Header validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400));
    }
    next();
  }
],




}
