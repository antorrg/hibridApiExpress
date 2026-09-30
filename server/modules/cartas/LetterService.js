import  GenericService  from '../../Classes/GenericService.js'
import { UuidHandler } from "../../utils/UuidHandler.js";
import * as help from './helpers.js'
import { QueryTypes } from 'sequelize'
import { sequelize } from "../../database.js";
import { emailService } from '../contacts/MailService.js';


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
        const notificationSubject = 'Nueva carta para revisar'
        const notificationLetter = `
        Usted tiene una carta para revisar con tema ${dataNewLetter.tema} creada en ${new Date()}
        `
      await this.Model.create(dataNewLetter)
      void emailService
        .sendEmail('letters@appmail.com', notificationSubject, notificationLetter)
        .catch(error => {
            console.error('No se pudo enviar la notificación de la carta', error)
        })
      return 'ok'
    }
    async moderateLetter(id, data){
        const newData = {aprobada: help.validAprobada(data.aprobada)}
        const letter = await this.Model.findByPk(id)
        await letter.update(newData)
    }
    async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const response = await sequelize.query(`
        SELECT id, tema, mensaje
        FROM "Letters"
        WHERE aprobada = :aprobada
        ORDER BY id
        LIMIT :limit
        OFFSET :offset
        `,
        {
            replacements: {
                aprobada: true,
                limit,
                offset
            },
            type: QueryTypes.SELECT
        }
      )

        const [{ count }] = await sequelize.query(`
            SELECT COUNT(*) AS count
            FROM "Letters"
            WHERE aprobada = :aprobada
            `,
            {
                replacements: { aprobada: true },
                type: QueryTypes.SELECT
            }
        )
        const info = {
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        }
        return {
            info,
            data: response,
            count: Number(count)
        }
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
   
    async findAllLetters(page = 1, aprobada = false, limit = 10, tema = null) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const offset = (pageNum - 1) * limitNum;
      
      const isAprobada = help.validAprobada(aprobada);

      let whereClause = `WHERE aprobada = :aprobada`;
      const replacements = {
        aprobada: isAprobada,
        limit: limitNum,
        offset
      };

      if (tema && tema !== '' && tema !== 'all') {
        whereClause += ` AND tema = :tema`;
        replacements.tema = tema;
      }

      const response = await sequelize.query(`
          SELECT id, tema, mensaje, aprobada
          FROM "Letters"
          ${whereClause}
          ORDER BY id
          LIMIT :limit
          OFFSET :offset
          `,
          {
            replacements,
            type: QueryTypes.SELECT
          }
      );

      const [{ count }] = await sequelize.query(`
          SELECT COUNT(*) AS count
          FROM "Letters"
          ${whereClause}
          `,
          {
            replacements,
            type: QueryTypes.SELECT
          }
      );

      const totalElements = Number(count) || 0;
      const info = {
        currentPage: pageNum,
        totalPages: Math.ceil(totalElements / limitNum) || 1,
        total: totalElements
      };

      return {
        info,
        data: response,
        count: totalElements
      };
    }
    
    async deleteLetter(id){
        return await this.base.delete(id)
    }

}



