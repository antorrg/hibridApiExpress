import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { showSuccess } from '../Utils/toastify';
import {url} from '../main'

function AlertLogout({logout}) {
    const navigate = useNavigate()
    const landing = url? url : '/'
    //window.location.href=landing
    
  const sessionCleaner = () => {
    showSuccess("Sesión cerrada");
    // navigate("/");
    logout();
    setTimeout(() => {
      window.location.href=landing
    }, 1000);
  };

  return (
    <>
      <Alert variant="warning">
        <Alert.Heading>¡¡Advertencia!! </Alert.Heading>
        <p>
          Su sesion ya está iniciada ¿desea cerrar sesión?
        </p>
        <p>
        Si es asi pulse <strong>"Cerrar sesion"</strong>, parar cerrar esta ventana pulse <strong>"Salir"</strong>.
        </p>
        <hr />
        <div className="d-flex flex-row justify-content-between items-center">
          <a href= {landing} className='btn btn-sm btn-outline-secondary'>
            Salir
          </a>
          <Button onClick={() => sessionCleaner()} variant="outline-primary">
            Cerrar sesion
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default AlertLogout;