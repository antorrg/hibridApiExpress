

//?    db    88""Yb 88    88  88 88 88""Yb 88""Yb 88 8888b.     888888 Yb  dP 88""Yb 88""Yb 888888 .dP"Y8 .dP"Y8 
//?   dPYb   88__dP 88    88  88 88 88__dP 88__dP 88  8I  Yb    88__    YbdP  88__dP 88__dP 88__   `Ybo." `Ybo." 
//?  dP__Yb  88"""  88    888888 88 88""Yb 88"Yb  88  8I  dY    88""    dPYb  88"""  88"Yb  88""   o.`Y8b o.`Y8b 
//? dP""""Yb 88     88    88  88 88 88oodP 88  Yb 88 888888     888888 dP  Yb 88     88  Yb 888888 8bodP' 8bodP'
// todo :::::::::::::::::::::: Created at 12 - 12 - 2024 :::::::::::::::::::::::::::::::::::::::::::::::::::::::
//* :::::::::::::::::::::::::: Refactorized at 26 - 03 - 2025 ::::::::::::::::::::::::::::::::::::::::::::::::::


import app from './app.js'
import {sequelize} from "./database.js"
import env from './envConfig.js'
import initialUser from './helpers/initialUser.js'

app.listen(env.Port, async() => {
    try {
        await sequelize.sync({ force:true})
        await initialUser()
        console.log(`Server is listening at http://localhost:${env.Port}\nServer in ${env.Status}`);
        if(env.Status === 'development'){
            console.log(`Swagger: Vea y pruebe los endpoints en http://localhost:${env.Port}/api-docs`)
        }
    } catch (error) {
        console.error('Error syncing database: ',error)
    }
});
