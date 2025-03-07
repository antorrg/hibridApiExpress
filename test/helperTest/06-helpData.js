
export const userParser  = ({info})=>{
  return {  
    id: info.id,
    email: info.email,
    password: info.password,
    nickname:info.nickname,
    name: info.name,
    surname: info.surname,
    picture: info.picture,
    role: info.role,
    country: info.country,
    enable: info.enable
  }
}
export const respUserCreate = {

"message": "Created succesfully!", 
"results": {
  "id": expect.any(String),
  "country": null, 
  "email": "juangarcia@gmail.com", 
  "name": null,
  "surname": null,
  "enable": true, 
  "nickname": "juangarcia", 
  "picture": "https://firebasestorage.googleapis.com/v0/b/proyectopreact.appspot.com/o/images%2F1729212207478-silueta.webp?alt=media&token=f0534af7-2df4-4efc-af99-f3f44bf72926", 
  "role": "Usuario"
}, 
"success": true
}
export const userLogged = {
  "id": expect.any(String), 
  "country": null, 
    "email": "josenomeacuerdo@hotmail.com", 
    "enable": true, 
    "nickname": "josenomeacuerdo", 
    "picture": "url", 
    "role": "Administrador"
}

export const respUserGet = {
  "message": null, 
  "results": [{
    "country": null, 
    "email": "josenomeacuerdo@hotmail.com",
    "name": null,
    "surname": null, 
    "enable": true, 
    "id": expect.any(String), 
    "nickname": "josenomeacuerdo", 
    "picture": expect.any(String), 
    "role": "Administrador"
  }, {
    "country": null, 
    "email": "juangarcia@gmail.com", 
    "name": null,
    "surname": null,
    "enable": true, 
    "id": expect.any(String), 
    "nickname": "juangarcia", 
    "picture": expect.any(String), 
    "role": "Usuario"
  }], 
  "success": true
}

export const respGetById ={
  "message": null, 
  "results": {
    "country": null, 
    "email": "juangarcia@gmail.com", 
    "name": null,
    "surname": null,
    "enable": true, 
    "id": expect.any(String), 
    "nickname": "juangarcia", 
    "picture": expect.any(String), 
    "role": "Usuario"
  }, "success": true
}
export const newUser = {
  "country": "argentina", // Parametro a actualizar. 
    "email": "josenomeacuerdo@hotmail.com", 
    "enable": true, 
    "picture": "url",
   "name": "jose", // Parametro a actualizar. 
   "surname": "nomeacuerdo" // Parametro a actualizar. 
    
}

export const updatedUser = {
  "message": "Updated succesfully", 
  "results": {
    "country": "argentina", 
    "email": "josenomeacuerdo@hotmail.com", 
    "enable": true, 
    "id": expect.any(String), 
    "nickname": "josenomeacuerdo", 
    "picture": expect.any(String), 
    "role": "Administrador"
  }, "success": true

}
export const newUserLogged = {
  "id": expect.any(String), 
  "country": 'argentina', 
    "email": "josenomeacuerdo@hotmail.com", 
    "enable": true, 
    "nickname": "josenomeacuerdo", 
    "picture": "url", 
    "role": "Administrador"
}