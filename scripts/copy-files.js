import shell from 'shelljs';

// Crear las carpetas destino si no existen

if (!shell.test('-d', 'dist/views')) {
  shell.mkdir('-p', 'dist/views');
}

// Copiar imágenes
//shell.cp('-R', 'src/public/images/*', 'dist/images');

shell.cp('-R', 'public/favicon.png', 'dist/assets');

// Copiar vistas
shell.cp('-R', 'views/*', 'dist/views');

console.log('Archivos copiados exitosamente.');
