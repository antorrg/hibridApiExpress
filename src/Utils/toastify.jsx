import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
 
 // errorHandler.js
  const handleError = (error) => {
    console.error('hand: ',error)
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      if (status === 400) {
        // Acceso no autorizado
        toast.error(`Error ${status}. ${data}`);
      } else if (status === 401) {
        // Acceso no autorizado
        toast.error(`Error ${status}. ${data}`);
      } else if (status === 404) {
        // Recurso no encontrado
        toast.error(`Error ${status}. ${data}`);
      } else if (status === 403){
        toast.error(`Error ${status}. ${data}`);
      }else {
        // Otro error del servidor
        toast.error(`Error ${status}. ${data}`);
        //alert('Ocurrió un error en el servidor. Por favor, inténtalo de nuevo más tarde.');
      }
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      toast.error('No se recibió respuesta del servidor.');
      //alert('No se recibió respuesta del servidor. Por favor, inténtalo de nuevo más tarde.');
     } //else {
    //   // Error durante la configuración de la solicitud
    //   console.error('Error durante la configuración de la solicitud:', error.message);
    //   alert('Ocurrió un error durante la configuración de la solicitud. Por favor, inténtalo de nuevo.');
    // }
  };



const showSuccess = (mensaje) => {
  toast.success(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};

const showError = (mensaje) => {
  toast.error(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showInfo = (mensaje) => {
  toast.info(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showWarn = (mensaje) => {
  toast.warn(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
export {
    handleError,
    showError,
    showInfo,
    showSuccess,
    showWarn
};