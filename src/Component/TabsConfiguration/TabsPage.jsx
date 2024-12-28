import React, { useState } from 'react';
import {url} from '../../main'
import {useNavigate,useLocation} from 'react-router-dom'
import {useAuth} from '../../Auth/AuthContext/AuthContext'
import { showSuccess } from '../../Utils/toastify';
//import showConfirmationDialog from '../../Utils/sweetalert';
import TabsLayout from './TabsLayout';
import Config from './TabsComponents/Config'



const TabsPage = () => {
  const {logout }= useAuth()
  const navigate = useNavigate();
  const location = useLocation();

   // Lee el parámetro "tab" de la URL. Si no existe, usa un valor predeterminado.
   const queryParams = new URLSearchParams(location.search);
   const initialTab = queryParams.get('tab') || 'producto';

  const [activeTab, setActiveTab] = useState(initialTab);
  

  const handleTabChange = (activeTab) => {
    activeTab==='videos'? navigate(`/admin?tab=videos&subtab=facebook`):
    navigate(`/admin?tab=${activeTab}`); // Actualiza la URL.
    setActiveTab(activeTab);
  };
   const landing = url? url : '/'
  const sessionCleaner = async()=>{
    // const confirmed = await showConfirmationDialog(
    //   "¿Está seguro de cerrar sesión?"
    // );
    // if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      showSuccess("Sesión cerrada");
     
      window.location.href=landing
      //navigate("/");
      setTimeout(() => {
        logout();
      }, 1000);
    //}
  }

  return (
    <>
    <TabsLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      sessionCleaner={sessionCleaner}
    >
      {activeTab === 'producto' && (
        <Config/>
      )}
      {activeTab === 'portada' && (
        <Config/>
      )}
      {activeTab === 'users' && (
        <Config/>
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
