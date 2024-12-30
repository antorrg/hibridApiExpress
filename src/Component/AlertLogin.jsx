import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { showSuccess } from '../Utils/toastify';
import {basePath} from '../main'

function AlertLogout({logout, isLoading, setIsLoading}) {
    const navigate = useNavigate()
    const landing = basePath? basePath : '/'
    //window.location.href=landing
    
  const sessionCleaner = async() => {
    if (isLoading) return; // Prevenir múltiples clics
        setIsLoading(true);
        const response = await logout()
        if(response){
          showSuccess("Sesión cerrada");
          window.location.href=landing
        }
        setIsLoading(false);
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
          <Button onClick={() => sessionCleaner()} variant="outline-primary" disabled={isLoading}>
            Cerrar sesion
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default AlertLogout;