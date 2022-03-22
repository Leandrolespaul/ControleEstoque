// const numeros = new Array(1, 2, 3, 4, 6, 78)

// function filtrar(func) {
//     const itensFiltrados = []
//     for(let i = 0; i < this.length; i++) {
//         if(func(this[i])) {
//             itensFiltrados.push(this[i])
//         }
//     }
//     return itensFiltrados
// }
// Array.prototype.filtrar = filtrar
// console.log(numeros.filtrar(numero => numero > 3))

// console.log(numeros.filter(numero => numero < 3))

// // const arrayFiltrado = filtrar(numeros, numero => numero > 3) 
// // console.log(arrayFiltrado)

// // const arrayFiltrado2 = filtrar(numeros, numero => numero < 3)     
// // console.log(arrayFiltrado2)

// // const arrayFiltrado3 = filtrar(['Philipe', 'Leandro', 'Danilo'], pessoaBozo => pessoaBozo === 'Philipe' || pessoaBozo === 'Leandro')
// // console.log(arrayFiltrado3)



const arrayNumeral = [2,3,4,5,6]
const iten = arrayNumeral.filter(numeros => numeros !== 2)
console.log(iten)