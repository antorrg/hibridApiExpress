export default {
    testEnvironment: 'node',   // Define que el entorno de prueba es Node.js
    setupFilesAfterEnv: ['./test/jest.setup.js'], // Ejecuta este archivo después de cargar el entorno
    testTimeout: 10000,
    testPathIgnorePatterns: [
        '<rootDir>/test/helperTest/',  // Ignora el directorio firebase
        '<rootDir>/server/utils/expressValidator.js',    // Ignora el directorio config
        '<rootDir>/server/firebase.js' // Ignora un archivo específico
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/test/helperTest/',  // Ignora el directorio de helpers en la cobertura
        '<rootDir>/server/utils/expressValidator.js', // Ignora este archivo en la cobertura
        '<rootDir>/server/firebase.js'
    ],
   
}