import { useEffect,useState } from 'react'
import {Routes, Route } from 'react-router-dom'
import {Login, Admin, Detail} from './Views/Index'


function App() {
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


  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Guarda el tema en localStorage
  };
 
  return (
    
    <div className={`app ${theme}-mode`}>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/admin/product/:id' element={<Detail/>}/>
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
