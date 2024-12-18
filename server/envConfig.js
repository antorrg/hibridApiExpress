import dotenv from 'dotenv'

const configEnv = {
    development: '.env.development',
    preview: '.env.development',
    test: '.env.test',
    production: '.env'
  };
  
const envFile = configEnv[process.env.NODE_ENV] || '.env';

dotenv.config({path:envFile})

// Derivar el estado desde el archivo de configuración
const status = Object.keys(configEnv).find(key => configEnv[key] === envFile) || 'production';


const {PORT, URL, DATABASE_URL}= process.env;

export default {
    Port : PORT,
    Url : URL,
    Status :status,
    dbConnect: DATABASE_URL,
}