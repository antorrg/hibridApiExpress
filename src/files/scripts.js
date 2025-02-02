import './bootstrap.bundle.js';
import { colorModes } from './colorModes.js';
import modalService from './modalService.mjs';
import {
  showConfirmationModal,
  sendEmailFunction,
  validateEmail,
  capitalizeFirstLetter,
  showModal,
  showExit,
} from './contact.mjs';

document.addEventListener('DOMContentLoaded', () => {
  colorModes();

  // Selección del formulario
  const contactForm = document.getElementById('sendEmail');
  if (contactForm) {
    const initialInput = {
      email: '',
      subject: '',
      message: '',
    };

    let input = { ...initialInput };
    let error = { ...initialInput };

    const handleOnChange = (event) => {
      const { name, value } = event.target;
      input[name] = value;
      error = validateEmail(input);

      // Actualiza el texto de error para cada campo
      document.getElementById(`error${capitalizeFirstLetter(name)}`).textContent =
        error[name];

      // Habilita o deshabilita el botón de enviar
      const permit =
        !input.email.trim() ||
        !input.subject.trim() ||
        !input.message.trim() ||
        error.email ||
        error.subject ||
        error.message;
      document.getElementById('submitButton').disabled = permit;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      error = validateEmail(input);

      // Verifica errores antes de enviar
      if (Object.values(error).some((err) => err)) {
        return;
      }
      //console.log('submit', input)
      // Confirmación antes de enviar
      const accepted = await showConfirmationModal({
        type: 'info',
        title :'¿Está seguro de enviar el email?',
         message: 'Por favor confirme su acción.',
      });
      if (accepted) {
        showModal();

        const response = await sendEmailFunction(input);
        if (response.ok) {
          modalService.closeAll();
          showExit();

          // Redirección después de 4 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 4000);
        } else {
          modalService.closeAll();
          alert('Hubo un problema.');
        }
      }
    };
    async function sendEmailFunction(input) {
      try {
        //console.log("enviando post", input)
        const response = await fetch("/api/v1/contact", {
          method:"POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(input)
        });
        if(response.ok){
          input = { ...initialInput };
              document.getElementById('email').value = '';
              document.getElementById('subject').value = '';
              document.getElementById('message').value = '';
        return {ok: true}
      }else{return {ok:false}}
      } catch (error) {
        showFailed("¡Error inesperado. Intente nuevamente más tarde!")
         modalService.closeAll()
      }
    }
    // Agrega eventos a los campos y botones
    document.getElementById('email').addEventListener('input', handleOnChange);
    document.getElementById('subject').addEventListener('input', handleOnChange);
    document.getElementById('message').addEventListener('input', handleOnChange);
    const submitButton = document.getElementById('submitButton')
    submitButton.addEventListener('click', handleSubmit);

    // Botón de cancelar
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
      cancelButton.addEventListener('click', async () => {
        const accepted = await showConfirmationModal({
          type: 'info',
          title :'¿Seguro quiere salir?',
           message: 'Será redirigido a Home.',
        });
        if (accepted) {
        window.location.href = '/';
          };
      })
     }
    }
// Funciones de whatsApp: 
    
});
