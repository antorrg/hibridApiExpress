import env from "../envConfig.js"

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'hibridApiExpress',
        version: '1.0.0',
        description: 'Documentación de mi API hibridApiExpress con Swagger. Es necesario primero hacer login...(vea Readme.md)',
      },
      
      servers: [
        {
          url: `http://localhost:${env.Port}`,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./server/swaggerDocs/swUser.js', './server/swaggerDocs/swLanding.js', './server/swaggerDocs/swProduct.js'], // Ruta a tus archivos de rutas
    swaggerOptions: {
      docExpansion: "none", // 👈 Oculta todas las rutas al cargar
    },
  };
  
  export default swaggerOptions;