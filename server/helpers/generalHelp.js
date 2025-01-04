
const productCleaner = (cont, withItem)=>{
    const dataItems = cont.Items? cont.Items : []
     const items = withItem? dataItems.map((item)=> aux(item, false)): null
    const info = {
        id:cont.id,
        title:cont.title,
        landing: cont.landing,
        logo:cont.logo,
        info_header: cont.info_header,
        info_body: cont.info_body,
        url: cont.url,
        enable: cont.enable,
    };
    return withItem? {info, items} : info
      
    
};
const aux = (info, detailItem,)=>{
    let trunc = detailItem? info.text : truncateText(info.text, 12)
    return {
        id: info.id,
        img: info.img,
        text: trunc,
        ProductId: info.ProductId,
        enable: info.enable,
    }
};

 const truncateText = (text, wordLimit = 10)=>{
    const words = text.split(' ');    // Ejemplo de uso
    if (words.length <= wordLimit) {  //   const text = "Texto de ejemplo";
        return text; }                //   const ejemplo = truncateText(text, 12);
    const truncatedWords = words.slice(0, wordLimit); 
    return truncatedWords.join(' ') + '...'; 
}
const filterItem = (data, isAdmin)=>{
    const item = isAdmin? data : data.filter(item =>item.enable===true);
    if(item.length===0){
        return emptyItem()
    }
    return item;
}
const emptyItem = ()=>{
    return [{
        id: 0,
        img: 'Not found',
        text: 'Item borrado o bloqueado por admin.',
        ProductId: 0,
        enable: true,
    }]
}
const dataEmptyPage = {
    
        id: false,
        title: 'No hay datos aun',
        landing: 'No hay datos aun',
        logo: 'No hay datos aun',
        info_header: 'No hay datos aun',
        info_body: 'No hay datos aun',
        url: 'No hay datos aun',
        enable: false,
    
};
const dataEmptyLanding = {
    
        id: false,
        title: 'Pagina web con ejemplos ',
        info_header: 'Antorrg web services. Diseño y creación de páginas web multipage y singlepage',
        picture: 'https://img.freepik.com/fotos-premium/naturaleza-natural-paisajes-naturales_1417-70.jpg',
        description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
        enable: true,
    
};

 const userParser = (data) => {
    const roleParsed =  scope(data.role) 
    return {
        id: data.id,
        email: data.email,
        nickname: data.nickname,
        given_name: data.given_name,
        picture: data.picture,
        role: roleParsed,
        country: data.country,
        enable: data.enable,
    };
 };
const scope = (role)=>{
    switch(role){
      case 2 : 
      return "Moderador"
      case 9 :
      return "Administrador"
      case 1 :
      default :
      return "Usuario"
    }
}
const revertScope = (role)=>{
    switch(role){
      case "Moderador": 
      return 2;
      case "Administrador":
      return 9
      case "Usuario":
      default :
      return 1
    }
}
const emptyUser = {
    
        id: false,
        email: 'No hay datos aun',
        nickname: 'No hay datos aun',
        given_name: 'No hay datos aun',
        picture: "https://c0.klipartz.com/pngpicture/813/118/gratis-png-icono-de-silueta-plantilla-de-persona-en-blanco.png",
        role: 'No hay datos aun',
        country: 'No hay datos aun',
        enable: 'No hay datos aun',
   
}
const protectProtocol = (data)=>{
    return data.role === 9? true: false;
   }

const cleanerLanding = (data)=>{
    return {
        id:data.id,
        image:data.picture,
        title:data.title,
        info_header:data.info_header,
        description:data.description,
        enable: data.enable
    }
}
const optionBoolean = (save)=>{
    if(save==='true'|| save === true){
        return true
    }else if(save==='false'|| save === false){
        return false;
    }else{
        return false;
    }
}
export default {
productCleaner,
aux,
truncateText,
dataEmptyPage,
userParser,
scope,
revertScope,
emptyUser,
protectProtocol,
dataEmptyLanding,
cleanerLanding,
optionBoolean,
};
 