export const element = {
  title: 'Este es el titulo',
  info_header: 'palabras',
  description: 'maspalabras',
  picture: 'urls',
}
export const landParser = (info)=>{
    return {
        id: info.id,
        title:info.title,
        info_header: info.info_header,
        description: info.description,
        picture: info.picture,
        enable:info.enable,
        deletedAt: info.deletedAt,
    }
};


export const dataCreated = {
    id:1,
    title: 'Este es el titulo',
    info_header: 'palabras',
    description: 'maspalabras',
    picture: 'urls',
    enable: true,
    deletedAt: null,
  };
  export const dataUpdated = {
    id:1,
    title: 'Este es el titulo',
    info_header: 'palabras',
    description: 'maspalabras',
    picture: 'urls',
    enable: false,
    deletedAt: null,
  };
  export const dataImageUpdated = {
    id:2,
    title: 'Este es el titulo',
    info_header: 'palabras',
    description: 'maspalabras',
    picture: 'urlSecond',
    enable: true,
    deletedAt: null,
  };

  const redirectionImages = jest.fn().mockImplementation((imageUrl) => {
    try {
      if(imageUrl.trim()=== 'url')
      
      throw new Error('Simulated error');
    } catch (error) {
      throw error;
    }
  });
//product
  export const product ={
    title: "Title",
    logo: "logo",
    landing: "landing",
    info_header: "info_header",
    info_body: "info_body",
    url: "url",
    items :[
      {
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
      },
      {
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
      
      },
      {
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
        
      },
      
    ]
  }

  export const itemCreate = {
    id: 1,
    img:"img",
    text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
  }
  export const item = {
    id: 6,
    img:"img",
    text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
    ProductId: 1,
    enable: true
  }

  export const genralProductResponse = [{
    id:1,
    title: "Title",
    logo: "logo",
    landing: "landing",
    info_header: "info_header",
    info_body: "info_body",
    url: "url",
    enable: true
  }];

  export const productResponse = {
   info: { 
    id:1,
    title: "Title",
    logo: "logo",
    landing: "landing",
    info_header: "info_header",
    info_body: "info_body",
    url: "url",
    enable: true},
    items :[
      {
        id:1,
        ProductId:1,
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras...",
        enable: true,
      },
      {
        id:2,
        ProductId:1,
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras...",
        enable: true,
      
      },
      {
        id:3,
        ProductId:1,
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras...",
        enable: true,
        
      },
      {
        id:4,
        ProductId:1,
        img:"img",
        text: "Este es un texto de pruebas a fin de contar las palabras...",
        enable: true,
        
      }
    ]
  };

  export const itemResponse = {
      id:1,
      ProductId:1,
      img:"img",
      text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
      enable: true,
      
    }
    export const productUpdated = {
       
       id:1,
       title: "Title",
       logo: "logo",
       landing: "landing",
       info_header: "info_header",
       info_body: "info_body",
       url: "pepe",
       enable: true}
    
       export const itemUpdated = {
        id:1,
        ProductId:1,
        img:"pepe",
        text: "Este es un texto de pruebas a fin de contar las palabras que se utilizan en el.",
        enable: true,
        
      }

  // export const product ={
  //   title: "title",
  //   logo: "logo",
  //   landing: "landing",
  //   info_header: "info_header",
  //   items :[
  //     {id: 1,
  //       img:2,
  //       text: "text",
  //       ProductId: 1,
  //       enable: true
  //     },
  //     {id: 3,
  //       img:"img",
  //       text: "text",
  //       ProductId: 1,
  //       enable: true
  //     },
  //     {id: 4,
  //       img:"img",
  //       text: "text",
  //       ProductId: 1,
  //       enable: true
  //     },
  //     {id: 5,
  //       img:"img",
  //       text: "text",
  //       ProductId: 1,
  //       enable: true
  //     }
  //   ]
  // }