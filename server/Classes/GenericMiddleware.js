import { middError } from '../errorHandler.js';
import {validate as isUUID} from 'uuid'

class GenericMidd {
    constructor(requiredFields = []) {
        this.requiredFields = requiredFields;
        this.validateFields = this.validateFields.bind(this);
        
    }

    validateFields(requiredFields = this.requiredFields){
        //console.log('Constructor requiredFields:', requiredFields);
        return (req, res, next) => {
            const newData = req.body;

            // Verificar si req.body está vacío o no tiene claves
            if (!newData || Object.keys(newData).length === 0) {
                return next(middError('Invalid parameters', 400))
            }

            // Filtrar campos faltantes
            //console.log('a ver si estan: ',requiredFields)
            const missingFields = requiredFields.filter(field => !(field in newData));
            if (missingFields.length > 0) {
                return next(middError(`Missing parameters: ${missingFields.join(', ')}`, 400));
            }
            next();
        };
    }
     // Middleware para validar UUIDs en un campo específico
     validateUUID(fieldName) {
        return (req, res, next) => {
            const value = req.params[fieldName]
            
            if (!value|| !isUUID(value)) {
                return next(middError(`The ${value} field must be a valid UUID`, 400));
            }
            next();
        };
    }     
    validateINT(fieldName) {
        return (req, res, next)=>{
            const value = req.params[fieldName];

        if (value === undefined || !Number.isInteger(Number(value))) {
            return next(middError(`The ${fieldName} must be a integer number.`, 400));
        }

        next();
        }
    }
        // Middleware para validar números en un campo específico
        validateNumbers(fieldName) {
            return (req, res, next) => {
                const value = req.body[fieldName];
    
                if (value === undefined || !Number.isInteger(Number(value))) {
                    return next(middError(`The ${fieldName} must be a integer number.`, 400));
                }
    
                next();
            };
        }
       
        validateFieldContent(fieldName, fieldRegex, errorMessage = null) {
            return (req, res, next) => {
                const value = req.body[fieldName];

                 // Validar que fieldRegex sea una expresión regular
                if (!(fieldRegex instanceof RegExp)) {
                    throw new Error("fieldRegex must be a valid RegExp instance");
                }
        
                if (!value || value === undefined || !fieldRegex.test(value)) {
                    const defaultMessage = `Field '${fieldName}' does not meet the required format..`;
                    return next(middError(errorMessage || defaultMessage, 400));
                }
        
                next();
            };
        }
    
        
};
class ProductMidd extends GenericMidd {
    constructor(requiredFields = [], secondFields = []) {
        super(requiredFields);
        this.defaultSecondFields = secondFields;
    };
    // Validar los campos del body y además los items
    validateFieldsWithItems(requiredFields = this.requiredFields, secondFields = this.defaultSecondFields) {
        return (req, res, next) => {
            //console.log('primero: ', requiredFields+ ' // '+secondFields)
            // Llamar al método del padre para validar los campos generales
            //console.log('soy el product: ', req.body)
            const validateGeneralFields = super.validateFields(requiredFields);
            validateGeneralFields(req, res, (err) => {
                if (err) return next(err); // Si hay error en los campos generales, salir

                // Validar el array de "items"
                const secondData = req.body.items;
                //console.log('soy los items',secondData)

                if (!secondData || !Array.isArray(secondData) || secondData.length === 0) {
                    return next(middError('Missing items array or empty array', 400));
                }
                //Validar que express-validator no convierta el array en una cadena de strings
                const invalidStringItems = secondData.filter(
                    (item) => typeof item === "string"
                );
                if (invalidStringItems.length > 0) {
                    return next(
                        middError(
                            `Invalid "items" content: expected objects but found strings (e.g., ${invalidStringItems[0]})`,
                            400
                        )
                    );
                }

                secondData.forEach((item, index) => {
                    const missingItemFields = secondFields.filter((field) => !(field in item));
                    if (missingItemFields.length > 0) {
                        return next(
                          middError(`Missing parameters in items[${index}]: ${missingItemFields.join(', ')}`, 400)
                        );
                    }
                });

                // Si todo está bien, pasar al siguiente middleware
                next();
            });
        };
    }
};

export {
        GenericMidd,
        ProductMidd
       }



