import dotenv from 'dotenv'

const configEnv = {
    development: '.env.development',
    preview: '.env.development',
    test: '.env.test',
    production: '.env'
  };
  
const envFile = configEnv[process.env.NODE_ENV] || '.env';

dotenv.config({path:envFile})

const redirection = ()=>{
  switch(process.env.NODE_ENV){
    case 'development':
      return 'http://localhost:5173/'
    case 'preview':
      return '/'
    case 'test':
      return 'http://localhost:5173/'
    case 'production':
      return '/'
  }
}
// Derivar el estado desde el archivo de configuración
const status = process.env.NODE_ENV;


const {PORT, URL, DATABASE_URL, SECRET_KEY, ADMIN_USER, ADMIN_PASS, USER_IMG, API_KEY, PROJECT_ID, AUTH_DOMAIN, STORAGE_BUCKET, MESSAGIN_SEND_ID, APP_ID, MEASUREMENT_ID, GMAIL_USER, 
  GMAIL_APP_PASS, WHATS_APP_NUMBER, WHATS_APP_MESSAGE}= process.env;


export default {
    Port : PORT,
    Url : URL,
    Status : status,
    Redirection : redirection(),
    SecretKey : SECRET_KEY,
    optionRender: process.env.NODE_ENV === 'production',
    dbConnect: DATABASE_URL,
    user : ADMIN_USER,
    pass : ADMIN_PASS,
    image : USER_IMG,

    fireApiK:API_KEY,
    firePId: PROJECT_ID,
    fireDomain: AUTH_DOMAIN,
    fireStoreBuck: STORAGE_BUCKET,
    fireMess : MESSAGIN_SEND_ID,
    fireAppId: APP_ID,
    fireMeasure: MEASUREMENT_ID,

    GmailUser: GMAIL_USER,
    GmailPass: GMAIL_APP_PASS,
    WhatsAppNumber: WHATS_APP_NUMBER,
    WhatsAppMessage: WHATS_APP_MESSAGE,
}

