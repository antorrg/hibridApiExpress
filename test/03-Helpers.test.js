
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
describe('Testing the "aux" function (already tested in productCleaner filtering the Items)', ()=>{
    it('Remaining test of aux delivering full text for Item', ()=>{
        const info = help.aux(mock.item, true)
        expect(info).toEqual(mock.resItem)
    })
})
describe('userParser function (owner or parsed user, custom function)', ()=>{
    it('Should return an array of users with no visible password', ()=>{
        const info = mock.users.map(user => help.userParser(user, true))
        expect(info).toEqual(mock.usersParsed)
    })
    it('It should return the user without a visible password', ()=>{
        const info = help.userParser(mock.user, true)
        expect(info).toEqual(mock.userParsed)
    })
});
describe('The "cleanerLanding" function ', () => {
    it('Should retrieve the landing page elements', () => {
        const info = help.cleanerLanding(mock.landingPage)
        expect(info).toEqual(mock.landingParsed)
    })
})


