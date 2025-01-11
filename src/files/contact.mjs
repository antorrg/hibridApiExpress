import modalService from "./modalService.mjs";

export const validateEmail = (input) => {
  const errors = { email: '', subject: '', message: '' };
  if (!input.email) errors.email = 'Email es requerido';
  else if (!/\S+@\S+\.\S+/.test(input.email)) errors.email = 'Email es invalido';
  if (!input.subject) errors.subject = 'Asunto es requerido';
  if (!input.message) errors.message = 'Mensaje es requerido';
  return errors;
};

export const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


export function showConfirmationModal({
  type = 'info',
  title= 'Titulo',
  message= 'mensaje',
}) {
    return new Promise((resolve) => {
      modalService.showModal({
            type,
            title,
            message,
            showAcceptButton: true,
            showDenyButton: true,
            autoHide: false,
            onAccept: () => resolve(true), // Resuelve la promesa como `true` al aceptar
            onDeny: () => resolve(false),  // Resuelve la promesa como `false` al cancelar
        });
    });
  }
  
  export async function sendEmailFunction(input) {
    try {
      console.log("enviando post", input)
      const response = await fetch("/api/v1/contact", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(input)
      });
      if(response.ok)
        input = { ...initialInput };
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
      return {ok: true}
    } catch (error) {
      showFailed("¡Error inesperado. Intente nuevamente más tarde!")
       modalService.closeAll()
    }
  }

  export function showModal() {
      modalService.showModal({
        type: 'warning',
        title: 'Aguarde un momento...',
        loader: true,
        autoHide: false,
    });
  }
  
  
export const showExit = () => {
      modalService.showModal({
        type: 'success',
        title: '!Envío exitoso!',
        message: 'Prontamente será contactado',
        icons: true,
        iconType: 'checkmark'
    });
}
export const showFailed = (message) => {
  modalService.showModal({
    type: "error",
    title: "¡Envío fallido!",
    message: message,
  })
}