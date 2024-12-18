export const throwError = (message, status)=>{
    const error = new Error(message)
    error.status = status
    throw error;
}
export const renderError = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            res.status(error.status || 500).render('error', {
                message: error.message || 'Error inesperado',
                status: error.status || 500
            });
        }
    };
};

export const catchController = (controller)=>{ //Para los controladores
    return (req, res, next)=>{
        return controller(req, res, next).catch(next);
    }
}

export const middError = (message, status)=>{ //Para los middlewares: estos seguiran el formato "return next(middError(message, status))"
    const error = new Error(message);
    error.status = status;
    return error;
}