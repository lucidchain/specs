document.addEventListener('DOMContentLoaded', function () {
    // Buscar el enlace específico por su href
    const logButton = document.querySelector('a[href="javascript:void(0);"]');
    
    // Añadir un evento de clic para alternar el tema
    if (logButton) {
      logButton.addEventListener('click', function() {
        // Obtener el atributo data-theme del body
        const currentTheme = document.body.getAttribute('data-theme');
        
        // Alternar entre el tema claro y oscuro
        if (currentTheme === 'dark') {
          document.body.setAttribute('data-theme', 'light');  // Cambiar a claro
          console.log("Tema cambiado a claro");
        } else {
          document.body.setAttribute('data-theme', 'dark');
          console.log("Tema cambiado a oscuro");
        }
      });
    }
  });
  