import Swal from 'sweetalert2';

export const showSuccessMessage = (title = 'Success!', text = '', timer = 2000) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    showConfirmButton: false,
    timer,
  });
};
