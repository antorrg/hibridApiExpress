import GenericService from './genericService.js';
import bcrypt from 'bcrypt'
import {generateToken} from '../middlewares/authMiddlewares.js'


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
    async login(data, parserFunction = null) {
        try {
            const existingRecord = await this.Model.findOne({ 
                where: {
                    email: data.email,
                    deletedAt: false
                } 
            });
            if (!existingRecord) {
                eh.throwError(`This ${this.Model.name.toLowerCase()} name do not exists`, 400);
            }
            if (!existingRecord.enable) {
                eh.throwError(`User is blocked`, 400);
            }
            const passwordMatch = await bcrypt.compare(data.password, existingRecord.password)
            if (!passwordMatch) {eh.throwError('Invalid password', 400)}
            return {
                user: parserFunction ? parserFunction(existingRecord) : existingRecord,
                token: generateToken(existingRecord)
            }
        } catch (error) {
            throw error;
        }
    }

}
export default UserService
