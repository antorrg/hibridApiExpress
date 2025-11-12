import env from '../../envConfig.js'
import { middError } from '../../errorHandler.js';
import help from '../../helpers/generalHelp.js'
import bcrypt from 'bcrypt'



const dataUser = (req, res, next)=>{
    const user = req.body;
    if(!user || !user.email){return next(middError('Email es requerido', 400))}
   
    req.body.password = env.pass;
    req.body.role = 1;
    req.body.picture = env.image;
    next();
}
const upgradeUserParser =(req, res, next) =>{

            const role = req.body.role;
            const enable= req.body.enable;
            // Intentar convertir el role
            const newRole = help.revertScope(role);
            if (newRole === undefined || newRole === null) {
                return next(middError('El campo role no es válido', 400 ));
            }
            req.body.enable = help.optionBoolean(enable)
            req.body.role = newRole;
            //console.log('Middleware ejecutado correctamente:', req.body);
            next();
      
};
const profileUserAccess = (req, res, next)=>{
    const {id} = req.params;
    const {userId}= req.userInfo;
    if(!id || !userId){return next(middError('Faltan parametros', 400))}
    if(id !== userId){return next(middError('Solo el propietario puede actualizar su perfil', 400))}

    next();
}

const profileParserInfo = (req, res, next)=>{
    const { email } = req.body;

    if( !email ){return next(middError('Falta el email!', 400))}
    
    req.body.nickname = email.split('@')[0];

    next();
}
const verifyOwnerActionsInBody = (req, res, next)=>{
    const {id} = req.body;
    const {userId}= req.userInfo;
    if(!id || !userId){return next(middError('Faltan parametros', 400))}
    if(id !== userId){return next(middError('Solo el propietario puede ejecutar esta acción', 400))}
    next();
};

const verifyOwnerActionsInParam = (req, res, next)=>{
    const {id} = req.params;
    const {userId}= req.userInfo;
    if(!id || !userId){return next(middError('Faltan parametros', 400))}
    if(id !== userId){return next(middError('Solo el propietario puede ejecutar esta acción', 400))}
    next();
};

const hasheredPass = async(req, res, next)=>{
    const hashedPass = await bcrypt.hash(req.body.password, 12);
    
    req.body.password = hashedPass;

    next()
}

const resetPassParser = async(req, res, next)=>{
    req.body = {};
    const hashedPass = await bcrypt.hash(env.pass, 12);
    req.body.password = hashedPass;
    next()
};

export {
    dataUser,
    upgradeUserParser,
    profileUserAccess,
    profileParserInfo,
    verifyOwnerActionsInBody,
    verifyOwnerActionsInParam,
    hasheredPass,
    resetPassParser 
};