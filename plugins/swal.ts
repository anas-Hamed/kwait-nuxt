import Swal from 'sweetalert2';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swal: Swal.fire.bind(Swal),
    },
  };
});
