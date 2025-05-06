import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook personalizado para manejar estados de carga y navegación
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.navigateOnSuccess - Si debe navegar al finalizar con éxito
 * @param {number} options.navigateTo - Destino de navegación (-1 para volver)
 * @param {Function} options.onSuccessCallback - Función adicional a ejecutar en caso de éxito
 * @param {Function} options.onFailCallback - Función adicional a ejecutar en caso de fallo
 * @returns {Object} - Estado y funciones para manejar la carga
 */
const useLoadingState = (options = {}) => {
  const {
    navigateOnSuccess = true,
    navigateTo = -1,
    onSuccessCallback,
    onFailCallback
  } = options;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Función para manejar el éxito de una operación
   */
  const handleSuccess = () => {
    setIsLoading(false);
    
    // Ejecutar callback adicional si existe
    if (onSuccessCallback) {
      onSuccessCallback();
    }
    
    // Navegar si está configurado
    if (navigateOnSuccess) {
      navigate(navigateTo);
    }
  };

  /**
   * Función para manejar el fallo de una operación
   */
  const handleFailure = () => {
    setIsLoading(false);
    
    // Ejecutar callback adicional si existe
    if (onFailCallback) {
      onFailCallback();
    }
  };

  /**
   * Inicia una operación asíncrona con estado de carga
   * @param {Function} asyncOperation - Función asíncrona a ejecutar
   */
  const executeWithLoading = async (asyncOperation) => {
    try {
      setIsLoading(true);
      await asyncOperation();
      handleSuccess();
    } catch (error) {
      console.error("Error en la operación:", error);
      handleFailure();
    }
  };

  return {
    isLoading,
    setIsLoading,
    handleSuccess,
    handleFailure,
    executeWithLoading
  };
};

export default useLoadingState;