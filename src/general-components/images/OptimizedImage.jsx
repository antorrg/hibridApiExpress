import { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  placeholderColor = "#f0f0f0",
  objectFit = "cover" 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width, height });

  // Si no se proporcionan dimensiones, intentamos obtenerlas de antemano
  useEffect(() => {
    if (!width || !height) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgDimensions({
          width: img.width,
          height: img.height
        });
      };
    }
  }, [src, width, height]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  // Estilos para el contenedor que mantiene las dimensiones
  const containerStyle = {
    position: 'relative',
    width: imgDimensions.width || '100%',
    height: imgDimensions.height || 'auto',
    backgroundColor: placeholderColor,
    overflow: 'hidden',
    display: 'inline-block'
  };

  // Estilos para la imagen
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    opacity: loading ? 0 : 1,
    transition: 'opacity 0.3s ease'
  };

  // Estado de error (imagen no cargada)
  if (error) {
    return (
      <div 
        style={containerStyle} 
        className={`image-error ${className}`}
        role="img"
        aria-label={`Error loading image: ${alt}`}
      >
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mx-auto"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={`image-container ${className}`}>
      {/* Skeleton carga */}
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {/* Imagen real */}
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default OptimizedImage;