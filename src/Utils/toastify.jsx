import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
 
 // errorHandler.js
  const handleError = (error) => {
    //console.error('hand: ',error)
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data.message;
        toast.error(`Error ${status}. ${data}`);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      toast.error('No se recibió respuesta del servidor.');
     } else {
      toast.error('Ocurrió un error durante la configuración de la solicitud. Por favor, inténte de nuevo.');
    }
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