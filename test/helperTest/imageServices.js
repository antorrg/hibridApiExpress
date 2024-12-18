import fs from 'fs'
import path from 'path'

export const deleteImages = (imgUrl)=>{
  try {
    if(imgUrl==='url'){
      return 'image deleted'}
  } catch (error) {
    throw error
  }
  
}
export const redirectionImages = async(imgUrl)=>{
    escribirUrlEnArchivo(imgUrl, 'urls.txt');
    }


function escribirUrlEnArchivo(url, filePath) {
  const rutaCompleta = path.resolve(filePath);

  // Asegurarse de que el archivo existe o crearlo
  fs.appendFile(rutaCompleta, `${url}\n`, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo:', err);
    } else {
      console.log(`URL escrita correctamente en ${rutaCompleta}`);
      return `URL escrita correctamente en ${rutaCompleta}`;
    }
  });
}

// Ejemplo de uso
// const url = 'https://example.com';
// const archivo = 'urls.txt';


