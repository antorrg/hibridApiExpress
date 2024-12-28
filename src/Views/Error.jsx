import { useEffect } from "react";
import { useLocation} from "react-router-dom";
import {url} from '../main'
//import './styles/error.css'

const Error = () => {
  const location = useLocation();

  const inicio = url ? url : "/";

  useEffect(() => {
    setTimeout(() => {
      window.location.href = inicio;
    }, 5000);
  }, []);

  const error = location.state || {
    status: "Desconocido",
    message: "Ha ocurrido un error inesperado",
  };
  return (
    <div className="backgroundPages">
      <div className="container-md modal-content rounded-4 shadow">
      <div className="coverBack">
        <h1>Error {error.status}</h1>
        <p>{error.message}</p>
        <a href={inicio}>Volver a inicio...</a>
      </div>
      </div>
    </div>
  );
};

export default Error;
