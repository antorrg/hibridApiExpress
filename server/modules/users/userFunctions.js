import env from '../../envConfig.js'
import { middError } from '../../errorHandler.js';
import help from '../../helpers/generalHelp.js'



const dataUser = (req, res, next)=>{
    const user = req.body;
    if(!user || !user.email){return next(middError('Email is required', 400))}
   
    req.body.password = env.pass;
    req.body.role = 1;
    req.body.picture = env.image;
    next();
}
const upgradeUserParser =(req, res, next) =>{
    
        try {
            // Validar si el role está presente en el body
            if (!req.body.role) {
               return next(middError('El campo role es obligatorio', 400 ));
            }
            const role = req.body.role;
    
            // Intentar convertir el role
            const newRole = help.revertScope(role);
            //console.log('soy newRole', newRole)
    
            if (newRole === undefined || newRole === null) {
                return next(middError('El campo role no es válido', 400 ));
            }
            req.body.role = newRole;
            //console.log('Middleware ejecutado correctamente:', req.body);
            next();
        } catch (error) {
            //console.error('Error en el middleware updateUserParser:', error);
            return next(middError('Error interno en el servidor', 500 ));
        }
};
const profileUserAccess = (req, res, next)=>{
    const {id} = req.params;
    const {userId}= req.userInfo;
    if(!id || !userId){return next(middError('Missing parameters', 400))}
    if(id !== userId){return next(middError('Only the owner can update his profile', 400))}

    next();
}

const profileParserInfo = (req, res, next)=>{
    const { email } = req.body;

    if( !email ){return next(middError('Missing email!', 400))}
    
    req.body.nickname = email.split('@')[0];

    next();
}
const verifyOwnerActions = (req, res, next)=>{
    const {id} = req.body;
    const {userId}= req.userInfo;
    if(!id || !userId){return next(middError('Missing parameters', 400))}
    if(id !== userId){return next(middError('Only the owner can perform this action', 400))}
    next();
};

const resetPassParser = (req, res, next)=>{
  
    req.body.password = env.pass;

    next()
};

export {
    dataUser,
    upgradeUserParser,
    profileUserAccess,
    profileParserInfo,
    verifyOwnerActions,
    resetPassParser 
};