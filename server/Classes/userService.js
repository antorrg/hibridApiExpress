import GenericService from './genericService.js';
import * as eh from '../errorHandler.js'
import bcrypt from 'bcrypt'



class UserService extends GenericService{
    constructor(Model){
        super(Model)
    }

    async create(data, uniqueField= null, parserFunction= null) {
        const hashedPassword = await bcrypt.hash(data.password, 12);
        data.password = hashedPassword;
        data.nickname = data.email.split("@")[0];
        try{
        const existingRecord = await this.Model.findOne({ where: {email:data.email} });
            
        if (existingRecord) {
            eh.throwError(`This ${this.Model.name.toLowerCase()} name already exists`, 400);
        }
        const newRecord = await this.Model.create(data);
        return parserFunction ? parserFunction(newRecord) : newRecord;
       }catch(error){
        throw error;
       }
    }
    async login(data, isVerify = null) {
        console.log('soy el loginservice: ',data)
        console.log('soy verify en el service:', isVerify)
        try {
            // Buscar usuario según el caso
            const user = isVerify 
                ? await this.Model.findByPk(data.id)
                : await this.Model.findOne({ where: { email: data.email } });

            if (!user) {
                eh.throwError(`User not found`, 404);
            }

            if (!user.enable) {
                eh.throwError(`User is blocked`, 400);
            }

            const passwordMatch = await bcrypt.compare(data.password, user.password);
            if (!passwordMatch) {
                eh.throwError('Invalid password', 400);
            }

            // Retornar según el caso
            return isVerify ? 'Password verified successfully' : user;
        } catch (error) {
            throw error;
        }
    }

}
export default UserService
