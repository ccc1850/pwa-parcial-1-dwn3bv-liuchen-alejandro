
/* BUSCAR POR CAMBIOS DE INTERNET */
window.addEventListener('online', updateHeaderColor);
window.addEventListener('offline', updateHeaderColor);


/* FUNCION PARA CAMBIAR EL COLOR DEL HEADER */
function updateHeaderColor() {
    var online = navigator.onLine;
    var header = document.querySelector('.navbar');
    
    if (online) {
        header.style.backgroundColor = '#ea354b'; // Online color
    } else {
        header.style.backgroundColor = 'black'; // Offline color
    }
}

updateHeaderColor();