import env from '../../envConfig.js'
import { middError } from '../../errorHandler.js';



const dataUser = (req, res, next)=>{
    const user = req.body;
    if(!user || !user.email){return next(middError('Email is required', 400))}
   
    req.body.password = env.pass;
    req.body.role = 1;
    req.body.picture = env.image;
    next();
}
export default dataUser;