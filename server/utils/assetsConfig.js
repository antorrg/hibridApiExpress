/* istanbul ignore file */
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
