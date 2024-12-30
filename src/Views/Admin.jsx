import AdminNav from '../Component/AdminNav'
import { Outlet } from "react-router-dom";


const Admin = () => {
  
 
  return (
    <div className='backgroundOnlyImage'>
      <AdminNav/>
      <Outlet/>
      </div>
  )
}

export default Admin