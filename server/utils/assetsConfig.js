import fs from 'fs'
import path from 'path'
import env from '../envConfig.js' // Ajusta la ruta al archivo donde tienes tu configuración de entorno

let manifest;

if (env.Status === 'production') {
  const manifestPath = path.resolve('dist/.vite/manifest.json');
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

function getAssetPath(assetName) {
  if (env.Status === 'production') {
    const key = `src/files/${assetName}`;
    if (manifest[key]) {
      return `/${assetName}`; // O `/${manifest[key].file}` si prefieres esa lógica
    }
    //console.warn(`Asset "${assetName}" no encontrado en el manifest.`);
    console.log('ass', assetName)
    return assetName;
  }
  return `/files/${assetName}`;
}

export default getAssetPath


// app.locals.getAssetPath = (assetName) => {
//   if (env.Status === 'production') {
//     // Verificamos si el assetName existe en el manifiesto
//     const key = `src/files/${assetName}`; // Asegúrate de que esta clave coincida con la del manifiesto
//     if (manifest[key]) {
//         //console.log(assetName)
//         //return `/${manifest[key].file}`; // Retorna la ruta generada en dist
//         return `/${assetName}`
//     }
//     console.warn(`Asset "${assetName}" no encontrado en el manifest.`);
//     return assetName; // Fallback si no se encuentra el asset
//   }
//   console.log(assetName)
//   return `/files/${assetName}`; // Ruta en desarrollo
// };