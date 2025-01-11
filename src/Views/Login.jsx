import {useState} from 'react'
import {basePath} from '../main'
 import {useAuth} from '../Auth/AuthContext/AuthContext'
import {useNavigate}from "react-router-dom" ;
import { validLogin } from '../Component/IndexComponent';
import {userLogin} from '../Redux/endPoints'
import AlertLogin from '../Component/AlertLogin'
import Loading from '../Component/Loading';
import EyeSlash from 'bootstrap-icons/icons/eye-slash.svg';
import Eye from 'bootstrap-icons/icons/eye.svg';



const Login = () => {
  const inicio = basePath? basePath: '/'
  const navigate = useNavigate()
  const { authenticated, login, logout}=useAuth();
  console.log('autenticado: ',authenticated)
  const [showPassword, setShowPassword]= useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const closeLogin = ()=> window.location.href=(inicio)
  const succesLogin = ()=>{navigate('/admin')}

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
    setError({
      ...error,
      [name]: validLogin({ ...input, [name]: value })[name],
    });
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    if (isLoading) return; // Prevenir múltiples clics
        setIsLoading(true);
        const response = await userLogin.post('login', input, succesLogin, false, null, 'Login successfully');
        if(response){
          const user = response.user;
          const token = response.token
          login(user, token)
        }
        setIsLoading(false);
   
   
    setInput({
      email: "",
      password: "",
    });
  }
  const permit= (!input.email.trim() ||!input.password.trim() ||error.email|| error.password || isLoading)? true :false;

   
  return (
    <>
  <div className="backgroundPages">
    <div className='coverBack'>
    {isLoading?
    <Loading/>
    :
      <div className="container-md modal-content backgroundFormColor loginContainer rounded-4 shadow">
        <div className="form-signin m-auto p-3">
          {authenticated?
          <AlertLogin logout={logout} isLoading={isLoading} setIsLoading={setIsLoading}/>
          :
          <section>
            <div className="d-flex justify-content-between align-items-center">
              <img className="mb-4" src="/logo.png" alt="" width="95" height="93"/>
              <button type="button" onClick={closeLogin}className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <h1 className="h3 mb-3 fw-normal">Inicie sesion</h1>
            <div className="form-floating">
               <input type="email" className="form-control" value={input.email} name="email" placeholder="name@example.com"onChange={(event) => handleChange(event)}/>
               <label htmlFor="floatingInput">Email address</label>
               {error.email && <p className='errorMsg'>{error.email}</p>}
            </div>
            <div className="form-floating d-flex justify-content-between align-items-center">
              <input type={showPassword ? 'text' : 'password'} className="form-control" value={input.password} name="password" placeholder="Password" onChange={(event) => handleChange(event)} />
              <label htmlFor="floatingPassword">Password</label>
              <button type= 'button' onClick={()=>{setShowPassword(!showPassword)}} className='buttonEye'>
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
              </button>
              {error.password && <p className='errorMsg'>{error.password}</p>}
            </div>
            <button className="btn btn-primary w-100 py-2" onClick={handleSubmit} disabled={permit}>Iniciar</button>
            <br></br>
            <br></br>
            <br></br>
          </section>
                  }
        </div>
      </div>
    }
    </div>
  </div>
  </>
  );
};

export default Login;