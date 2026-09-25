export function validTema(value){
    const tema = [
    'Para quien lo necesite',
    'Ansiedad',
    'Duelo',
    'Soledad',
    'Empezar de nuevo',
    'Gratitud'
]
const values = tema.filter(tema => (tema === value))

 if(values.length === 0){
    throw new Error('Tema no valido')
 }
 return value
}
export function validAprobada(b){
    if(b === true || b === 'true'){
        return true
    }
    return false
}