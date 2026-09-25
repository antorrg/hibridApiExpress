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
    Video,
    Client,
    ApiKey,
    Letter

}= sequelize.models;

//* Relations:
Product.hasMany(Item)
Item.belongsTo(Product)

VideoGroup.hasMany(Video)
Video.belongsTo(VideoGroup)

Client.hasMany(ApiKey, {
    foreignKey: 'clientId',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
})

ApiKey.belongsTo(Client, {
    foreignKey: 'clientId',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'

})

//* StarUp methods
function getNameDb(dbUri) {
 return dbUri.split('/').slice(-1).join()
}
async function startUp (syncDb = false, rewrite = false) {
  try {
    if (env.Status !== 'production' && syncDb===true) {
      try {
        await sequelize.sync({ force: rewrite })
       const message = `🧪 Synced database ${getNameDb(env.dbConnect)}: "force ${rewrite}"`
       console.log(message)
      } catch (error) {
        console.error(`❗Error syncing database ${getNameDb(env.dbConnect)}`, error)
        throw error
      }
    }
    await sequelize.authenticate()
    //eslint-disable-next-line
    const successMessage =`🟢​ Database postgreSQL "${getNameDb(env.dbConnect)}" initialized successfully!!`
    console.log(successMessage)
  } catch (error) {
    console.error('❌ Error conecting database!', error)
    throw error
  }
}
const closeDatabase = async () => {
  await sequelize.close()
  console.log('🛑 Database disconnect')
}

export {
    User,
    Product,
    Item,
    Landing,
    VideoGroup,
    Video,
    Client,
    ApiKey,
    Letter,
    startUp,
    closeDatabase,
    sequelize
}