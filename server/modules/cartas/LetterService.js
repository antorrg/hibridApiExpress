import  GenericService  from '../../Classes/GenericService.js'
import { UuidHandler } from "../../utils/UuidHandler.js";
import * as help from './helpers.js'
import { QueryTypes } from 'sequelize'
import { sequelize } from "../../database.js";

export class LetterService{
    constructor(Model){
        this.Model = Model
        this.base = new GenericService(Model)
    }
    async createLetter(data){
        const dataNewLetter = {
            id: UuidHandler.createUuid(),
            tema: help.validTema(data.tema),
            mensaje: data.mensaje
        }
      await this.Model.create(dataNewLetter)
    }
    async moderateLetter(id, data){
        const newData = {aprobada: help.validAprobada(data.aprobada)}
        const letter = await this.Model.findByPk(id)
        await letter.update(newData)
    }
    async getAll(){
        const response = await sequelize.query(`
            SELECT id, tema, mensaje
            FROM "Letters"
            WHERE aprobada = :aprobada
            `,
               {
          replacements: {aprobada: true},
          type: QueryTypes.SELECT
        })
        const [{count}] = await sequelize.query(`
            SELECT COUNT(*) AS count from "Letters"
            WHERE aprobada = true
            `,
            {type: QueryTypes.SELECT}
        )
        return { data: response, count: Number(count) }
    }
    async getById(id){
        const [result] = await sequelize.query(`
            SELECT *
            FROM "Letters"
            WHERE id = :id
            `,
            {
          replacements: {id},
          type: QueryTypes.SELECT
           }
        )
        return result
    }
    async findAllLetters(){
        const found = await sequelize.query(`
            SELECT *
            FROM "Letters"
            `,
            {type: QueryTypes.SELECT}
        )
        return found
    }
    async deleteLetter(id){
        return await this.base.delete(id)
    }

}



