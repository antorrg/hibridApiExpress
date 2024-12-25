import './bootstrap.bundle.js'
import {  toggleTheme } from './color-modes.js'
import { colorModes } from './colorModes.js';

document.addEventListener('DOMContentLoaded', () => {
    colorModes();
  });
// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggleBtn = document.getElementById('themeToggleBtn');
//     const themeOptions = document.querySelectorAll('.dropdown-item');
  
//     themeOptions.forEach(option => {
//       option.addEventListener('click', (e) => {
//         const selectedTheme = e.target.id;
  
//         switch (selectedTheme) {
//           case 'lightMode':
//             document.documentElement.setAttribute('data-theme', 'light');
//             themeToggleBtn.textContent = '☀️';
//             break;
//           case 'darkMode':
//             document.documentElement.setAttribute('data-theme', 'dark');
//             themeToggleBtn.textContent = '🌙';
//             break;
//           case 'autoMode':
//             document.documentElement.removeAttribute('data-theme');
//             themeToggleBtn.textContent = '☀️/🌙';
//             break;
//           default:
//             break;
//         }
//       });
//     });
//   });
  
//Scripts para las paginas server-rendering
// console.log('aqui estoy')
// document.addEventListener('DOMContentLoaded', () => {
//   const button = document.getElementById("next-page-button");
//   if (button) {
//       button.addEventListener("click", pageNumber);
//   }
// });
// document.addEventListener('DOMContentLoaded', ()=>{
//     const buttonTheme = document.getElementById("themeToggleBtn")
//     if(buttonTheme){
//         buttonTheme.addEventListener("click", ()=>{colorModes()})
//     }
// })

// document.addEventListener('DOMContentLoaded', () => {
//   const buttonTheme = document.getElementById('themeToggleBtn1');
//   if (buttonTheme) {
//     buttonTheme.addEventListener('click', toggleTheme);
//   }
// });


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Variables que pueden estar aqui o en otro sitio.
    // const pageNumber = () => {
    //     // Extraer el número actual desde la URL
    //     const currentPath = window.location.pathname;
    //     const currentPage = parseInt(currentPath.split('/').pop(), 10) || 1;
    
    //     // Calcular la próxima página
    //     const nextPage = currentPage < 826 ? currentPage + 1 : 1;
    
    //     // Redirigir a la nueva página
    //     window.location.href = `/about/${nextPage}`;
    // };
    