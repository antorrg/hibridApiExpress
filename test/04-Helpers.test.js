
import help from '../server/helpers/generalHelp.js'
import * as mock from './helperTest/04help.js'

/* Tenemos en la funcion homeCleaner tres escenarios diferentes:
-En el primero necesitamos solamente la informacion de la landing page
esta esta formada por un arreglo de objetos en los que necesitamos solo a info,
-En el segundo estamos en el detalle de una page: necesitamos un objeto con la info de la 
page, pero del campo items la imagen con los textos truncados 
-En el tercero estamos en el detalle de cada item adonde necesitamos la info de item pero 
con el texto completo.*/

describe('The"productCleaner" instances tests', ()=>{
    it('Should retrieving an array with objects.', ()=>{
        const info = mock.product.map(info1=> help.productCleaner(info1, false))
        console.log('info')
        expect(info).toEqual(mock.ResProd)
    });
    it('It should return a parsed object in the same way, plus the items with the text cut off (10 words).', ()=>{
        const info = help.productCleaner(mock.getOneProd, true)
        expect(info).toEqual(mock.parsedProduct)
    })
});
describe('Prueba de funcion "aux" (ya probada en homeCleaner filtrando los Items)', ()=>{
    it('Prueba restante de aux entregando texto completo para Item', ()=>{
        const info = help.aux(mock.item, true)
        expect(info).toEqual(mock.resItem)
    })
})
xdescribe('Funcion HolderParser (propietario o usuario parseado, funcion adaptada)', ()=>{
    it('Deberia retornar un arreglo de usuarios sin password visible', ()=>{
        const info = help.holderParser(mock.users, false)
        expect(info).toEqual(mock.parsedUsers)
    })
    it('Deberia retornar el usuario sin password visible', ()=>{
        const info = help.holderParser(mock.user, true)
        expect(info).toEqual(mock.parsedUser)
    })
})

