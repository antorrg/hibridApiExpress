import React from 'react'
import {url } from '../main'


const Login = () => {
  
  const inicio = url? url : '/'
  return (
    <div>
      Login
      <a className = 'btn btn-sm btn-primary mt-3 ms-3' href={`${inicio}`}>Cancelar</a>
    </div>
  )
}

export default Login