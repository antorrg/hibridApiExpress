
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
"id": expect.any(String),
"email": "josenomeacuerdo@hotmail.com",
"nickname": "josenomeacuerdo",
"name": "unknown",
"surname": "unknown",
"picture": "url",
"role": "User",
"country": "unknown",
"enable": "active",
}
