import { Sequelize } from "sequelize";
import schemas from "./schemas/index.js"
import env from "./envConfig.js"

const sequelize = new Sequelize(env.dbConnect, {
    logging: false,
    native: false,
});

Object.values(schemas).forEach((model)=> model(sequelize));

const {
    User, 
    Product,
    Item,
    Landing,

}= sequelize.models;

//* Relations:
Product.hasMany(Item)
Item.belongsTo(Product)

export {
    User,
    Product,
    Item,
    Landing,
    
    sequelize
}