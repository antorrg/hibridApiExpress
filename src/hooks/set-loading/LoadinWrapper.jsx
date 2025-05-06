// components/common/LoadingWrapper/index.jsx
import Loading from '../../Loading';

/**
 * Componente que muestra contenido o un indicador de carga según el estado
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isLoading - Indica si está cargando
 * @param {React.ReactNode} props.children - Contenido a mostrar cuando no está cargando
 * @returns {React.ReactNode} - Componente Loading o el contenido
 */
const LoadingWrapper = ({ isLoading, children }) => {
  if (isLoading) {
    return <Loading />;
  }
  
  return children;
};

export default LoadingWrapper;