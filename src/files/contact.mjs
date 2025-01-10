import modalService from "./modalService.mjs";


export function showConfirmationModal() {
    return new Promise((resolve) => {
      modalService.showModal({
            type: 'info',
            title: '¿Está seguro de enviar el e-mail?',
            message: 'Esta acción no se puede deshacer.',
            showAcceptButton: true,
            showDenyButton: true,
            autoHide: false,
            onAccept: () => resolve(true), // Resuelve la promesa como `true` al aceptar
            onDeny: () => resolve(false),  // Resuelve la promesa como `false` al cancelar
        });
    });
  }
  
  export function verModal() {
      modalService.showModal({
        type: 'warning',
        title: 'Espere un poquito...',
        loader: true,
        autoHide: false,
    });
  }
  
  
export async function someAsyncFunction() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ ok: true }), 2000);
    });
  }
  
export const verExit = () => {
      modalService.showModal({
        type: 'success',
        title: '!Envío exitoso!',
        message: 'Prontamente será contactado',
        icons: true,
        iconType: 'checkmark'
    });
}