import app from './server/app.js'
import {sequelize} from "./server/database.js"
import env from './server/envConfig.js'

app.listen(env.Port, async() => {
    try {
        await sequelize.sync({ force: true})
        console.log(`Server is listening at http://localhost:${env.Port}\nServer in ${env.Status}`);
    } catch (error) {
        console.error('Error syncing database: ',error)
    }
});
