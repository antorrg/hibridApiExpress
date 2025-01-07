import GenericService from "./genericService.js";
import { sequelize } from "../database.js";
import {throwError} from '../errorHandler.js'

class ProductServices extends GenericService {
  constructor(Model, Model2, useCache, useImage , deleteFunction) {
    super(Model, useCache, useImage, deleteFunction);
    this.Model2 = Model2;
    this.deleteFunction = deleteFunction || null;
    this.useImage = useImage || false;
  }
  //functions:
  async create(data, uniqueField = null) {
    let t;
    try {
      t = await sequelize.transaction();
      let whereClause = {};
      if (uniqueField) {
        whereClause[uniqueField] = data[uniqueField];
      }
      const existingRecord = await this.Model.findOne(
        { where: whereClause },
        {transaction :t}
      );

      if (existingRecord) {
        throwError(
          `This ${this.Model.name.toLowerCase()} ${
            uniqueField || "entry"
          } already exists`,
          400
        );
      }
      const items = data.items;
      const newRecord = await this.Model.create(data, { transaction: t });

      const newitems = await Promise.all(
        items.map(async (item) => {
          const newItem = await this.Model2.create(item, { transaction : t });
          await newRecord.addItem(newItem, { transaction : t});
          return newItem;
        })
      );
      await t.commit();
      if (this.useCache) this.clearCache();
        return 'Product created successfully'
   
    } catch (error) {
      if (t) {
        //console.error('soy transaction: ',t)
        await t.rollback();
      }
      throw error;
    }
  }
  async addItem(data) {
    try {
      const id = data.id;
      const body= {img:data.img, text:data.text}
      const referenceFound = await this.Model.findByPk(id);
      if (!referenceFound) {
        throwError(
          `This ${this.Model.name.toLowerCase()}
           do not exists`,
          404
        );
      }
      const newItem = await this.Model2.create(body);
      await referenceFound.addItem(newItem);
      return "Item created successfully";
    } catch (error) {
      throw error;
    }
  }
  async getById(
    id,
    parserFunction = null,
    parserFunction2 = null,
    isAdmin = false
  ) {
    try {
      //const data = await this.Model.findByPk(id);
      const data = await this.Model.scope(isAdmin ? "allRecords" : "enabledOnly").findByPk(id, {
        include: [
          {
            model: this.Model2,
            attributes: ["id", "img", "text", "ProductId", "enable"],
          },
        ],
      });

      if (!data) {
        throwError(
          `The ${this.Model.name.toLowerCase()} is not found!!`,
          404
        );
      }

      return parserFunction ? parserFunction(data, true) : data;
    } catch (error) {
      throw error;
    }
  }
  async getDetail(
    id,
    parserFunction = null,
    emptyObject = null,
    isAdmin = false
  ) {
    try {
      //const data = await this.Model.findByPk(id);
      const data = await this.Model2.scope(
        isAdmin ? "allRecords" : "enabledOnly"
      ).findByPk(id);

      if (!data) {
        emptyObject
          ? emptyObject()
          : throwError(
              `The ${this.Model.name.toLowerCase()} table is empty!!`,
              400
            );
      }

      return parserFunction ? parserFunction(data, true) : data;
    } catch (error) {
      throw error;
    }
  }
  async patcher(id, newData, parserFunction = null) {
    //console.log('soy newData en el patcher: ', newData)
    let imageUrl = "";
    try {
      const dataFound = await this.Model2.findByPk(id);

      if (!dataFound) {
        throwError(`${this.Model.name} not found`, 404);
      }

      // Si newData.enable existe, parsea el booleano
      if (newData.enable !== undefined) {
        newData.enable = this.optionBoolean(newData.enable);
      }
      if (
        this.useImage &&
        dataFound.picture &&
        dataFound.picture !== newData.picture
      ) {
        imageUrl = dataFound.picture;
      }
      const upData = await dataFound.update(newData);

      await this.handleImageDeletion(imageUrl);

      if (this.useCache) this.clearCache();

      return parserFunction ? parserFunction(upData, true) : upData;
      //return `${this.Model.name} updated succesfully`;
    } catch (error) {
      throw error;
    }
  }
  async deleteAll(id) {
    let imageUrl = "";
    let t;
    try {
      t = await sequelize.transaction()

      const dataFound = await this.Model.findByPk(id,{transaction: t});
      if (!dataFound) {
        throwError(`${this.Model} not found`, 404);
      }
      this.useImage ? (imageUrl = dataFound.picture) : "";

      // Borrar los Items asociados
      await this.Model2.destroy({
        where: { ProductId: id },
        transaction : t,
      });

      await dataFound.destroy({ transaction :t });
      await this.handleImageDeletion(imageUrl);
      await t.commit();

      if (this.useCache) this.clearCache();
      return `${this.Model.name} and items asociated deleted successfully`;
    } catch (error) {
      if (t) {
        await t.rollback();
      }
      throw error;
    }
  }
  async delete(id) {
    let imageUrl = "";
    try {
      const dataFound = await this.Model2.findByPk(id);
      if (!dataFound) {
        throwError(`${this.Model2} not found`, 404);
      }
      this.useImage ? (imageUrl = dataFound.picture) : "";

      await dataFound.destroy();
      await this.handleImageDeletion(imageUrl);

      if (this.useCache) this.clearCache();
      return `${this.Model2.name} deleted successfully`;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductServices;
