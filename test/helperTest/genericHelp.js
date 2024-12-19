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