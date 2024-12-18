import { useState } from 'react'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='container d-flex flex-column align-items-center justify-content-center'>
        <div className='flex-row '>
        <a className='btn btn-info p-1 mt-4 me-3' href="https://vite.dev" target="_blank">vite
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
      </div>
    </>
  )
}

export default App
