import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import style from './Edition.module.css';
import { useAuth } from '../../Auth/AuthContext/AuthContext';

const Edition = forwardRef(({ allowedRoles, userEditId, text, onClick, className, disabled }, ref) => {
  const customClass = className || style.button;
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);

  const checkPermission = useCallback(() => {
    if (!user) return false;

    const isRoleAllowed = allowedRoles.includes(user.role);
    const isEdittingOwnProfile = userEditId ? user.id === userEditId : false;

    return isRoleAllowed || isEdittingOwnProfile;
  }, [user, allowedRoles, userEditId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAllowed(checkPermission());
    }, 50);

    return () => clearTimeout(timer);
  }, [checkPermission]);

  if (!isAllowed) return null;

  return <button ref={ref} onClick={onClick} className={customClass} disabled={disabled}>{text}</button>;
});

Edition.displayName = 'Edition';

export default Edition;

// import React, { useState, useEffect } from 'react';
// import style from './Edition.module.css'
// import { useAuth } from '../../AuthContext/AuthContext';

// const Edition = ({ allowedRoles = (allowedRoles), userEditId, text, onClick, className }) => {
//   let customClass = className? className : style.button 
//   const { user } = useAuth();
//   const permit = user ? user.role : null;
  
//   // Estado para indicar si la verificación de la excepción está en curso
//   const [exceptionLoading, setExceptionLoading] = useState(true);
//   // Funcion para verificar si el usuario esta editando su perfil:
//   const allowing =(inf1, inf2)=>{
//     let result = false;
//     let userId= inf1 && inf1.id;
//     let editId= inf2 && inf2.id;
//     if(!userId || !editId){result = false;}
//     else if(userId ===editId){
//       result= true;
//     }else{result = false}
//     return result;
//   }
//   const exception = allowing(user.id, userEditId)

//   useEffect(() => {
//     // Simular una demora para la verificación de la excepción (por ejemplo, 1 segundo)
//     const timeout = setTimeout(() => {
//       setExceptionLoading(false);
//     }, 50);
//     // Limpiar el temporizador al desmontar el componente
//     return () => clearTimeout(timeout);
//   }, []);
 

  
//   // Verificamos si el rol actual está en los roles permitidos
//  //isEvalued fue hecha para forzar casos numericos a boolean
//   const isEvalued =(case1, case2)=>{
//      let result; 
//      if(case2.includes(case1)){result = true}
//      else{ result=false}
//      return result;
//    }
//    const isPermitted =isEvalued(permit, allowedRoles);
//   // Mostramos el botón solo si hay permiso o la verificación de la excepción ha terminado
//   return (
//     <>
//       {!exceptionLoading && (isPermitted||exception) && (
//         <button onClick={onClick} className={customClass}>{text}</button>
//       )}
//     </>
//   );
// };

// export default Edition;



//alowedRoles={(0, 2)}

