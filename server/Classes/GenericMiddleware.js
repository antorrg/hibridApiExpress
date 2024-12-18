import eh from '../errorHandler.js';
import {validate as isUUID} from 'uuid'

class GenericMidd {
    constructor(requiredFields = []) {
        this.requiredFields = requiredFields;
    }

    validateFields() {
        return (req, res, next) => {
            const newData = req.body;

            // Verificar si req.body está vacío o no tiene claves
            if (!newData || Object.keys(newData).length === 0) {
                return next(eh.middError('Invalid parameters', 400))
            }

            // Filtrar campos faltantes
            const missingFields = this.requiredFields.filter(field => !(field in newData));
            if (missingFields.length > 0) {
                return next(eh.middError(`Missing parameters: ${missingFields.join(', ')}`, 400));
            }
            next();
        };
    }
        // Middleware para validar UUIDs en un campo específico
        validateUUID() {
            return (req, res, next) => {
                const {id} = req.params
                
                if (!id || !isUUID(id)) {
                    return next(eh.middError(`El campo id debe ser un UUID válido`, 400));
                }
    
                next();
            };
        }     
        validateINT() {
            return (req, res, next)=>{
                const {id} = req.params;
                const idIsNumber = !isNaN(id) && Number.isInteger(parseFloat(id));
                if (!id) {return next(eh.middError('Missing id',400))}
               if (id && !idIsNumber) {return next(eh.middError('Invalid parameters', 400))}
                next()
            }
        }
        // Middleware para validar números en un campo específico
        validateNumbers(fieldName) {
            return (req, res, next) => {
                const value = req.body[fieldName];
    
                if (value === undefined || isNaN(Number(value))) {
                    return next(eh.middError(`El campo ${fieldName} debe ser un número válido`, 400));
                }
    
                next();
            };
        }
    
        // Middleware para validar formato de email en un campo específico
        validateFieldContent(fieldName, fieldRegex, errorMessage = null) {
            return (req, res, next) => {
                const value = req.body[fieldName];
        
                if (!value || !fieldRegex.test(value)) {
                    const defaultMessage = `El campo '${fieldName}' no cumple con el formato requerido.`;
                    return next(eh.middError(errorMessage || defaultMessage, 400));
                }
        
                next();
            };
        }
        
};

class ProductMidd extends GenericMidd {
    constructor(requiredFields = [], secondFields = []) {
        super(requiredFields);
        this.secondFields = secondFields; // Campos dentro de "items"
    }

    // Validar los campos del body y además los items
    validateFieldsWithItems() {
        return (req, res, next) => {
            const newData = req.body;

            // Llamar a validateFields del padre para los campos generales
            const validateGeneralFields = super.validateFields();
            validateGeneralFields(req, res, (err) => {
                if (err) return next(err); // Si hay error en campos generales, salir

                // Validar el array de "items"
                const secondData = newData.items;

                if (!secondData || !Array.isArray(secondData) || secondData.length === 0) {
                    return next(eh.middError('Missing items array or empty array', 400));
                }

                // Iterar sobre cada objeto dentro de items
                // for (let i = 0; i < secondData.length; i++) {
                //     const item = secondData[i];

                //     const missingFields = this.secondFields.filter(
                //         (field) => !(field in item)
                //     );

                //     if (missingFields.length > 0) {
                //         return next(
                //             eh.middError(
                //                 `Missing parameters in items[${i}]: ${missingFields.join(', ')}`,
                //                 400
                //             )
                //         );
                //     }
                // }
                secondData.forEach((item, index) => {
                    const missingFields = this.secondFields.filter((field) => !(field in item));
                    if (missingFields.length > 0) {
                        return next(
                            eh.middError(`Missing parameters in items[${index}]: ${missingFields.join(', ')}`, 400)
                        );
                    }
                });

                // Si todo está bien, pasar al siguiente middleware
                next();
            });
        };
    }
}

export {
GenericMidd,
ProductMidd,
}
