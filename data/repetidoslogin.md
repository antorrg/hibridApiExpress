El problema que describes puede ocurrir por varias razones, y hay formas de mitigarlo tanto en el **frontend** como en el **backend** para evitar múltiples peticiones al servidor y respuestas duplicadas.

---

### **Soluciones en el Frontend**
1. **Deshabilitar el botón tras el primer clic:**
   Una técnica común es deshabilitar el botón de login mientras la petición está en curso, para evitar que el usuario haga clic repetidamente.

   ```jsx
   import { useState } from "react";

   const LoginButton = ({ onSubmit }) => {
       const [isLoading, setIsLoading] = useState(false);

       const handleClick = async () => {
           if (isLoading) return; // Prevenir múltiples clics
           setIsLoading(true);
           await onSubmit();
           setIsLoading(false);
       };

       return (
           <button 
               onClick={handleClick} 
               disabled={isLoading} 
           >
               {isLoading ? "Cargando..." : "Login"}
           </button>
       );
   };
   ```

2. **Throttle o debounce:**
   Puedes usar bibliotecas como `lodash` para limitar la cantidad de veces que una función puede ejecutarse en un intervalo de tiempo.

   ```jsx
   import { useCallback } from "react";
   import { debounce } from "lodash";

   const handleLogin = useCallback(
       debounce(async () => {
           await onSubmit();
       }, 2000), // Limitar a una vez cada 2 segundos
       []
   );
   ```

3. **Estado de solicitud:**
   Asegúrate de manejar correctamente el estado de la solicitud para evitar conflictos entre varias peticiones simultáneas.

   ```jsx
   const handleSubmit = async () => {
       if (isLoading) return; // Verificar si ya hay una solicitud activa
       setIsLoading(true);
       try {
           await api.login(); // Lógica para enviar la petición
       } catch (error) {
           console.error(error);
       } finally {
           setIsLoading(false);
       }
   };
   ```

---

### **Soluciones en el Backend**
1. **Evitar solicitudes duplicadas en un corto periodo de tiempo:**
   Puedes implementar una lógica en tu backend para evitar que el mismo usuario haga múltiples solicitudes en un intervalo breve. Por ejemplo, puedes usar el **ID de la solicitud** o verificar que el token aún no ha sido procesado.

2. **Revisar tokens duplicados:**
   Si usas **JSON Web Tokens (JWT)**, verifica si el token que estás procesando ya fue usado recientemente para evitar reacciones indeseadas.

3. **Middleware anti-spam:**
   Implementa un middleware que limite la cantidad de peticiones desde el mismo cliente en un periodo corto.

   Ejemplo con Express.js:

   ```javascript
   const rateLimit = require("express-rate-limit");

   const loginLimiter = rateLimit({
       windowMs: 60 * 1000, // 1 minuto
       max: 5, // Máximo de 5 intentos
       message: "Demasiados intentos de inicio de sesión, por favor intente más tarde."
   });

   app.post("/login", loginLimiter, (req, res) => {
       // Lógica de autenticación
   });
   ```

---

### **Recomendación**
- Implementa ambas medidas. 
  - En el **frontend**, evita el comportamiento inmediato del doble clic deshabilitando el botón o limitando la frecuencia de la acción.
  - En el **backend**, asegúrate de validar las solicitudes entrantes para prevenir problemas de seguridad o mal uso.