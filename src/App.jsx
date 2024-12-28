import { useEffect,useState, useCallback } from 'react'
import {Routes, Route, useNavigate } from 'react-router-dom'
import {Login, Admin, Detail, Error} from './Views/Index'
import {useAuth} from './Auth/AuthContext/AuthContext'
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
    navigate('/error', { state: { status, message }})
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
      <SessionWarning expirationTime={expirationTime}/>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<ProtectedRoute> <Admin/> </ProtectedRoute>}>
        <Route index element={<TabsPage/>}/>
         </Route>
        <Route path='/error' element={<Error/>}/>
      </Routes>
      {/* <div className='container d-flex flex-column align-items-center justify-content-center'>
        <div className='flex-row '>
     
      <button 
        onClick={toggleTheme} 
        className="btn btn-sm btn-outline-secondary mt-4"
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      </div>
      </div> */}
      </div>
  )
}

export default App
