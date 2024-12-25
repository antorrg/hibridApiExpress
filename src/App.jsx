import { useEffect,useState } from 'react'


function App() {
  const [count, setCount] = useState(0)
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
  console.log('soy el tema react: ', theme)
  return (
    
    <div className={`app ${theme}-mode`}>
      <div className='container d-flex flex-column align-items-center justify-content-center'>
        <div className='flex-row '>
        <a className='btn btn-outline-info p-1 mt-4 me-3' href="https://vite.dev" target="_blank">vite
        </a>
        <a className='btn btn-warning p-1 mt-4 me-3' href="https://react.dev" target="_blank">
          React
        </a>
        </div>
      <h1>Vite + React</h1>
      <div className="card col-4 ms-5">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button 
        onClick={toggleTheme} 
        className="btn btn-outline-secondary"
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      </div>
      </div>
    
  )
}

export default App
