


export const producto =[ {
    id:1,
    nombre: "Videos producto uno",
    productId:1,
    videos: [
        {
            name: "video uno",
            youtubeId: "IwbyfPEB6pI"
        },
        {
            name: "video dos",
            youtubeId: "0aoec3jaklI"
        },
        {
            name: "video tres",
            youtubeId: "CVyEIDpIqow"
        },
         {
            name: "video cuatro",
            youtubeId: "E8weQyNVWug"
        }
    ]

},
{
    id:2,
    nombre: "videos producto 2",
    productId:2,
    videos: [
        {
            name: "Midudev",
            youtubeId: "IwbyfPEB6pI"
        },
         {
            name: "EDTeam ",
            youtubeId: "E8weQyNVWug"
        }
       
    ]
}]

export const getVideoById = (id)=>{
    const pepe = producto.find(acc => acc.id === Number(id))
    if(!pepe)return {nombre: 'video no encontrado'}
    return pepe
}