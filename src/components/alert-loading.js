const alertLoading = (swal) =>
  swal.fire({
    allowEnterKey: false,
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    html: `<div class="flex flex-col justify-center items-center p-5"><div class="loader-black"/></div>`,
  });

export default alertLoading;
