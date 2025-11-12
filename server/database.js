import { Sequelize } from "sequelize";
import schemas from "./schemas/index.js"
import env from "./envConfig.js"


const sequelize = new Sequelize(env.dbConnect, {
    dialect: "postgres",
    logging: false,
    native: false,
    dialectOptions: env.optionRender
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              }
            }
          : {}
});



Object.values(schemas).forEach((model)=> model(sequelize));

const {
    User, 
    Product,
    Item,
    Landing,
    VideoGroup,
    Video

}= sequelize.models;

//* Relations:
Product.hasMany(Item)
Item.belongsTo(Product)

VideoGroup.hasMany(Video)
Video.belongsTo(VideoGroup)

export {
    User,
    Product,
    Item,
    Landing,
    VideoGroup,
    Video,
    
    sequelize
}