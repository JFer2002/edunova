// Esperamos a que el HTML cargue completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleccionamos los elementos clave del Dashboard
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('open-sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    // Verificamos que los elementos existan en la página actual para evitar errores
    if (sidebar && openBtn && closeBtn) {
        
        // Cuando el usuario hace clic en el botón de hamburguesa (abrir)
        openBtn.addEventListener('click', () => {
            sidebar.classList.add('active'); // Añade la clase que desliza el menú hacia adentro
        });

        // Cuando el usuario hace clic en la "X" (cerrar)
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active'); // Quita la clase y oculta el menú
        });
    }
});