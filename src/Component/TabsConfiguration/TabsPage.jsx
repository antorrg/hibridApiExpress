import React, { useState } from 'react';
import {basePath} from '../../main'
import {useNavigate,useLocation} from 'react-router-dom'
import {useAuth} from '../../Auth/AuthContext/AuthContext'
import { showSuccess } from '../../Utils/toastify';
import showConfirmationDialog from '../../Utils/sweetalert';
import TabsLayout from './TabsLayout';
import Config from './TabsComponents/Config'
import Portada from './TabsComponents/Portada'
import Producto from './TabsComponents/Producto'
import Loading from '../Loading';
import Usuario from './TabsComponents/Usuario'



const TabsPage = () => {
  const {logout }= useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false)

   // Lee el parámetro "tab" de la URL. Si no existe, usa un valor predeterminado.
   const queryParams = new URLSearchParams(location.search);
   const initialTab = queryParams.get('tab') || 'producto';

  const [activeTab, setActiveTab] = useState(initialTab);
  

  const handleTabChange = (activeTab) => {
    activeTab==='videos'? navigate(`/admin?tab=videos&subtab=facebook`):
    navigate(`/admin?tab=${activeTab}`); // Actualiza la URL.
    setActiveTab(activeTab);
  };
   const landing = basePath? basePath : '/'
  const sessionCleaner = async()=>{
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de cerrar sesión?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
        if (isLoading) return; // Prevenir múltiples clics
            setIsLoading(true);
            const response = await logout()
            if(response){
              showSuccess("Sesión cerrada");
              window.location.href=landing
            }
            setIsLoading(false);
          }
  }

  return (
    <>
    {isLoading? <Loading/> : null}
    <TabsLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      sessionCleaner={sessionCleaner}
      isLoading = {isLoading}
    >
      {activeTab === 'producto' && (
        <Producto/>
      )}
      {activeTab === 'portada' && (
        <Portada/>
      )}
      {activeTab === 'users' && (
        <Usuario/>
      )}
      {activeTab === 'imagenes' && (
        <Config/>
      )}
      {activeTab === 'videos' && (
        <Config/>
      )}
      {activeTab === 'config' && (
        <Config/>
      )}
    </TabsLayout>
    </>
  );
};

export default TabsPage;
