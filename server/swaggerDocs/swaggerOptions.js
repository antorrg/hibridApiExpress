

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'hibridApiExpress',
        version: '1.0.0',
        description: 'Documentación de mi API hibridApiExpress con Swagger',
      },
      servers: [
        {
          url: 'http://localhost:4000',
        },
      ],
    },
    apis: ['./server/swaggerDocs/swUser.js', './server/swaggerDocs/swProducts.js'], // Ruta a tus archivos de rutas
  };
  
  export default swaggerOptions;