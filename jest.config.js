export default {
    testEnvironment: 'node',   // Define que el entorno de prueba es Node.js
    setupFilesAfterEnv: ['./test/jest.setup.js'], // Ejecuta este archivo después de cargar el entorno
    testTimeout: 10000,
}