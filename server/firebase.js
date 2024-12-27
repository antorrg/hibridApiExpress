// Import the functions you need from the SDKs you need
import en from './envConfig.js'
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Importa Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {
  
  apiKey: en.fireApiK,
  authDomain: en.fireDomain,
  projectId: en.firePId,
  storageBucket: en.fireStoreBuck,
  messagingSenderId: en.fireMess,
  appId: en.fireAppId,
  measurementId: en.fireMeasure
};

// Initialize Firebase (pueden exportarse)
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

//todo Aqui comienzan las funciones de subida y borrado de imagenes:

//import { storage } from '../firebase.js';
//import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


const uploadImageToFirebase = async (file) => {
  try {
    // Crear una referencia de almacenamiento con el nombre del archivo
    const storageRef = ref(storage, `imagesApi/${file.originalname}`);

    // Subir el archivo a Firebase Storage
    await uploadBytes(storageRef, file.buffer);

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    //console.log('aca etoy: ',downloadURL)

    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen a Firebase:', error);
    throw error;
  }
};


const deleteImageFromStorage = async(imageUrl)=> {
  try {
    // Extrae la ruta relativa del archivo desde la URL completa
    const bucketBaseUrl = "https://firebasestorage.googleapis.com/v0/b/";
    const storageBucket = storage.app.options.storageBucket;
    
    if (!imageUrl.startsWith(`${bucketBaseUrl}${storageBucket}`)) {
      throw new Error("La URL no pertenece al bucket de Firebase configurado.");
    }
    
    const filePath = imageUrl
      .replace(`${bucketBaseUrl}${storageBucket}/o/`, "")
      .split("?")[0]
      .replace("%2F", "/"); // Decodifica la ruta del archivo

    // Crea una referencia al archivo en Firebase Storage
    const fileRef = ref(storage, filePath);

    // Elimina el archivo
    await deleteObject(fileRef);
    console.log(`Imagen eliminada correctamente: ${filePath}`);
    return `Imagen eliminada correctamente`
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    throw error;
  }
}


export { uploadImageToFirebase,deleteImageFromStorage};
