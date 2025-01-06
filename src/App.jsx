import { useEffect,useState, useCallback } from 'react'
import {Routes, Route, useNavigate } from 'react-router-dom'
import {Login, Admin, Error} from './Views/Index'
import {useAuth} from './Auth/AuthContext/AuthContext'
import {CreateUser, UpdateUser,  CreateLanding, UpdateLanding, ProductView, ItemView, CreateProduct, CreateItem, UpdateProduct, UpdateItem, UserComp } from './Component/IndexComponent'
import SessionWarning from './Auth/AuthContext/SessionWarning'
import ProtectedRoute from './Utils/ProtectedRoutes'
import interceptor from './Utils/Interceptor'
import TabsPage from './Component/TabsConfiguration/TabsPage'



function App() {
  const {authenticated, logout, expirationTime}= useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('auto')
 
   // Leer el tema guardado en localStorage
   useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme); // Usa el tema guardado
    } else {
      // Si no hay tema guardado, determinar el tema por defecto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
     
    }
  }, []);

  useEffect(()=>{
    document.documentElement.setAttribute('data-bs-theme', theme);
  },[theme])

  const redirectToError = useCallback((status, message) => {
    navigate('/admin/error', { state: { status, message }})
  }, [navigate])
  
   useEffect(()=>{
    interceptor(logout, 
      redirectToError//(status, message) => navigate('/error', { state: { status, message }})
  )
   },[logout, redirectToError])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Guarda el tema en localStorage
  };
 
  return (
    
    <div className={`app ${theme}-mode`}>
      <button 
        onClick={toggleTheme} 
        className="btn btn-sm btn-outline-secondary mt-4"
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      <SessionWarning expirationTime={expirationTime}/>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<ProtectedRoute> <Admin/> </ProtectedRoute>}>
        <Route index element={<TabsPage/>}/>
        <Route path= '/admin/land/create' element={<CreateLanding/>}/>
        <Route path='/admin/land/update/:id' element={<UpdateLanding/>}/>
        <Route path='/admin/product/create' element= {<CreateProduct/>}/>
        <Route path='/admin/product/:id' element={<ProductView/>}/>
        <Route path='/admin/product/update/:id' element={<UpdateProduct/>}/>
        <Route path= '/admin/product/item/create/:id' element = {<CreateItem/>}/>
        <Route path= '/admin/product/item/:id' element= {<ItemView/>}/>
        <Route path= '/admin/product/item/update/:id' element= {<UpdateItem/>}/>
        <Route path= '/admin/users/updateinfo/:id' element= {<UpdateUser/>}/>
        <Route path= '/admin/users/:id' element={<UserComp/>}/>
        <Route path= '/admin/users/create' element=  {<CreateUser/>}/>
        <Route path='/admin/error' element={<Error/>}/>

         </Route>
      </Routes>
      
     
      
     
      </div>
  )
}

export default App
