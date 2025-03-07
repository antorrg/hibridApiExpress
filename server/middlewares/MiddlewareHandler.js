import { validate as uuidValidate } from 'uuid'

class MiddlewareHandler {
  static middError (message, status = 500) {
    const error = new Error(message)
    error.status = status
    return error
  }

  static validateBoolean (value) {
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    throw new Error('Invalid boolean value')
  }

  static validateInt (value) {
    const intValue = Number(value)
    if (isNaN(intValue) || !Number.isInteger(intValue)) throw new Error('Invalid integer value')
    return intValue
  }

  static validateFloat (value) {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue)) throw new Error('Invalid float value')
    return floatValue
  }

  // Nueva función para aislar la lógica de validación
  static validateValue (value, fieldType, fieldName, itemIndex = null) {
    const indexInfo = itemIndex !== null ? ` in item[${itemIndex}]` : ''

    switch (fieldType) {
      case 'boolean':
        return MiddlewareHandler.validateBoolean(value)
      case 'int':
        return MiddlewareHandler.validateInt(value)
      case 'float':
        return MiddlewareHandler.validateFloat(value)
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Invalid array value for field ${fieldName}${indexInfo}`)
        }
        return value
      case 'string':
      default:
        if (typeof value !== 'string') {
          throw new Error(`Invalid string value for field ${fieldName}${indexInfo}`)
        }
        return value
    }
  }

  static validateFields (requiredFields = []) {
    return (req, res, next) => {
      const newData = req.body
      if (!newData || Object.keys(newData).length === 0) {
        return next(MiddlewareHandler.middError('Invalid parameters', 400))
      }
      const missingFields = requiredFields.filter(field => !(field.name in newData))
      if (missingFields.length > 0) {
        return next(MiddlewareHandler.middError(`Missing parameters: ${missingFields.map(f => f.name).join(', ')}`, 400))
      }
      try {
        requiredFields.forEach(field => {
          const value = newData[field.name]
          newData[field.name] = MiddlewareHandler.validateValue(value, field.type, field.name)
        })

        Object.keys(newData).forEach(key => {
          if (!requiredFields.some(field => field.name === key)) {
            delete newData[key]
          }
        })
      } catch (error) {
        return next(MiddlewareHandler.middError(error.message, 400))
      }
      req.body = newData
      next()
    }
  }

  static validateFieldsWithItems (requiredFields = [], secondFields = [], arrayFieldName) {
    return (req, res, next) => {
      try {
        // Copiar datos del body
        const firstData = { ...req.body } // Datos principales
        const secondData = Array.isArray(req.body[arrayFieldName])
          ? [...req.body[arrayFieldName]] // Array dinámico
          : null

        // Validar existencia de `firstData`
        if (!firstData || Object.keys(firstData).length === 0) {
          return next(MiddlewareHandler.middError('Invalid parameters', 400))
        }

        // Verificar campos faltantes en `firstData`
        const missingFields = requiredFields.filter((field) => !(field.name in firstData))
        if (missingFields.length > 0) {
          return next(MiddlewareHandler.middError(`Missing parameters: ${missingFields.map(f => f.name).join(', ')}`, 400))
        }

        try {
          requiredFields.forEach(field => {
            const value = firstData[field.name]
            firstData[field.name] = MiddlewareHandler.validateValue(value, field.type, field.name)
          })

          // Filtrar campos adicionales no permitidos en `firstData`
          Object.keys(firstData).forEach(key => {
            if (!requiredFields.some(field => field.name === key)) {
              delete firstData[key]
            }
          })
        } catch (error) {
          return next(MiddlewareHandler.middError(error.message, 400))
        }

        // Validar existencia y estructura de `secondData`
        if (!secondData || secondData.length === 0) {
          return next(MiddlewareHandler.middError(`Missing ${arrayFieldName} array or empty array`, 400))
        }

        // Validar contenido de `secondData` (no debe contener strings)
        const invalidStringItems = secondData.filter((item) => typeof item === 'string')
        if (invalidStringItems.length > 0) {
          return next(
            MiddlewareHandler.middError(
              `Invalid "${arrayFieldName}" content: expected objects but found strings (e.g., ${invalidStringItems[0]})`,
              400
            )
          )
        }

        // Validar cada objeto dentro de `secondData`
        const validatedSecondData = secondData.map((item, index) => {
          const missingItemFields = secondFields.filter((field) => !(field.name in item))
          if (missingItemFields.length > 0) {
            return next(MiddlewareHandler.middError(
              `Missing parameters in ${arrayFieldName}[${index}]: ${missingItemFields.map(f => f.name).join(', ')}`,
              400
            ))
          }

          // Validar tipos de campos en cada `item` usando la función aislada
          secondFields.forEach(field => {
            const value = item[field.name]
            item[field.name] = MiddlewareHandler.validateValue(value, field.type, field.name, index)
          })

          // Filtrar campos adicionales en cada `item`
          return secondFields.reduce((acc, field) => {
            acc[field.name] = item[field.name]
            return acc
          }, {})
        })

        // Actualizar `req.body` con datos validados
        req.body = {
          ...firstData,
          [arrayFieldName]: validatedSecondData // Asignar dinámicamente
        }

        // Continuar al siguiente middleware
        next()
      } catch (err) {
        return next(MiddlewareHandler.middError(err.message, 400)) // Manejar errores
      }
    }
  }

  // MiddlewareHandler.validateQuery([{name: 'authorId', type: 'int', required: true}]),
  static validateQuery (requiredFields = []) {
    return (req, res, next) => {
      const queryObject = req.query || {}

      try {
        requiredFields.forEach(field => {
          let value = queryObject[field.name]

          if (value === undefined) {
            if (field.required) {
              throw new Error(`El parámetro "${field.name}" es obligatorio.`)
            }

            // Si no es obligatorio, asignamos valores por defecto
            switch (field.type) {
              case 'boolean':
                value = false
                break
              case 'int':
                value = 1
                break
              case 'float':
                value = 1.0
                break
              case 'string':
              default:
                value = ''
            }
          } else {
            // Validar el valor si está presente
            value = MiddlewareHandler.validateValue(value, field.type, field.name)
          }

          queryObject[field.name] = value
        })

        // Eliminar parámetros no esperados
        Object.keys(queryObject).forEach(key => {
          if (!requiredFields.some(field => field.name === key)) {
            delete queryObject[key]
          }
        })
      } catch (error) {
        return next(MiddlewareHandler.middError(error.message, 400))
      }

      req.query = queryObject
      next()
    }
  }

  static validateRegex (validRegex, nameOfField, message = null) {
    return (req, res, next) => {
      if (!validRegex || !nameOfField || nameOfField.trim() === '') {
        return next(MiddlewareHandler.middError('Missing parameters in function!', 400))
      }
      const field = req.body[nameOfField]
      const personalizedMessage = message ? ' ' + message : ''
      if (!field || typeof field !== 'string' || field.trim() === '') {
        return next(MiddlewareHandler.middError(`Missing ${nameOfField}`, 400))
      }
      if (!validRegex.test(field)) {
        return next(MiddlewareHandler.middError(`Invalid ${nameOfField} format!${personalizedMessage}`, 400))
      }
      next()
    }
  }

  static middUuid (req, res, next) {
    const { id } = req.params
    if (!id) return next(MiddlewareHandler.middError('Falta el id', 400))
    if (!uuidValidate(id)) return next(MiddlewareHandler.middError('Parametros no permitidos', 400))
    next()
  }

  static middIntId (req, res, next) {
    const { id } = req.params
    if (!id) return next(MiddlewareHandler.middError('Falta el id', 400))
    if (!Number.isInteger(Number(id))) return next(MiddlewareHandler.middError('Parametros no permitidos', 400))
    next()
  }

  static logRequestBody (req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
      return next()
    }
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] Request Body:`, req.body)
    next()
  }
}

export default MiddlewareHandler
