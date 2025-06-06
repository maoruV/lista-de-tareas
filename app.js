const input = document.getElementById('ingresa-tarea');
const boton = document.getElementById('boton-tareas');
const botonNombre = document.getElementById('boton-nombre')
const listaDeTarea = document.getElementById('lista-de-tareas');
const conteoTarea = document.getElementById('conteo-tareas')
const completadas = document.getElementById('completadas')
const seccionBienvenido = document.getElementById('bienvenido')
const seccionTareas = document.getElementById('tareas')
const inputNombre = document.getElementById('nombre')

cargarTareas()

seccionBienvenido.style.display = 'block'
seccionTareas.style.display = 'none';

function agregarNombre() {
    const nombreUsuario = inputNombre.value.trim();
    if (nombreUsuario) {
        const saludo = document.createElement('h2');
        saludo.innerText = `Hola, ${nombreUsuario}! Estas son tus tareas:`;
        seccionTareas.insertBefore(saludo, seccionTareas.firstChild);

        seccionBienvenido.style.display = 'none';
        seccionTareas.style.display = 'block';
    } else {
        alert("Por favor, ingresa tu nombre.");
    }

}

botonNombre.addEventListener('click', agregarNombre)
inputNombre.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        agregarNombre()

    }

});


function agregarTarea() {

    if (input.value) {
        //crear una tarea
        let tareaNueva = document.createElement('div');
        tareaNueva.classList.add('tarea');

        //texto que ingresa el usuario
        let texto = document.createElement('p');
        texto.innerText = input.value;
        tareaNueva.appendChild(texto);

        //crear y agregar el contenedor de iconos

        let iconos = document.createElement('div');
        iconos.classList.add('iconos');
        tareaNueva.appendChild(iconos);

        //Iconos
        let completar = document.createElement('i');
        completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');
        completar.addEventListener('click', tareaCompletada);


        let editar = document.createElement('i');
        editar.classList.add('bi', 'bi-arrow-clockwise', 'icono-editar')
        editar.addEventListener('click', editarTarea)

        let eliminar = document.createElement('i');
        eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
        eliminar.addEventListener('click', tareaEliminada);

        iconos.append(completar, editar, eliminar);

        //agregar tarea en la lista
        listaDeTarea.appendChild(tareaNueva);
        console.log(listaDeTarea.children)

    } else {
        alert("Ingresa una tarea");
    }
    guardarTareas()
    input.value = ""
    // Actualizar el conteo de tareas
    actualizarConteo();

}

function actualizarConteo() {
    const totalTareas = listaDeTarea.children.length;
    conteoTarea.innerText = totalTareas === 1 ? `Tarea: ${totalTareas}` : `Tareas: ${totalTareas}`;

}

function actualizarCompletadas() {
    const tareasCompletadas = document.querySelectorAll('.tarea.completada').length;
    completadas.innerText = tareasCompletadas === 1 ? `Completada: ${tareasCompletadas}` : `Completadas: ${tareasCompletadas}`;
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('icono-completar')) {
        actualizarCompletadas();
    }
});

function tareaCompletada(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.classList.toggle('completada');
    if (tarea.classList.contains('completada')) {
        const iconoEditar = tarea.querySelector('.icono-editar');
        if (iconoEditar) {
            iconoEditar.remove();
        }
    } else {
        // Si se desmarca como completada, agregar el icono de editar nuevamente
        const iconos = tarea.querySelector('.iconos');
        const editar = document.createElement('i');
        editar.classList.add('bi', 'bi-arrow-clockwise', 'icono-editar');
        editar.addEventListener('click', editarTarea);
        iconos.appendChild(editar);
    }

}


function editarTarea(e) {
    let tarea = e.target.parentNode.parentNode;
    let texto = tarea.querySelector('p');

    // Colocar el texto de la tarea en el campo de entrada
    input.value = texto.innerText;

    // Eliminar la tarea actual para que pueda ser reemplazada
    tarea.remove();

    // Actualizar el conteo de tareas
    actualizarConteo();
    actualizarCompletadas();

}



function tareaEliminada(e) {
    let tarea = e.target.parentNode.parentNode;
    tarea.remove()
    actualizarConteo();
    actualizarCompletadas();
}


boton.addEventListener('click', agregarTarea);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        agregarTarea()

    }

});

function guardarTareas() {
    const tareas = [];
    listaDeTarea.querySelectorAll('.tarea').forEach(tarea => {
        const texto = tarea.querySelector('p').innerText;
        const completada = tarea.classList.contains('completada');
        tareas.push({ texto, completada });
    });
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareasGuardadas.forEach(tarea => {
        let tareaNueva = document.createElement('div');
        tareaNueva.classList.add('tarea');
        if (tarea.completada) {
            tareaNueva.classList.add('completada');
        }

        let texto = document.createElement('p');
        texto.innerText = tarea.texto;
        tareaNueva.appendChild(texto);

        let iconos = document.createElement('div');
        iconos.classList.add('iconos');
        tareaNueva.appendChild(iconos);

        let completar = document.createElement('i');
        completar.classList.add('bi', 'bi-check-circle-fill', 'icono-completar');
        completar.addEventListener('click', tareaCompletada);

        let editar = document.createElement('i');
        editar.classList.add('bi', 'bi-arrow-clockwise', 'icono-editar');
        editar.addEventListener('click', editarTarea);

        let eliminar = document.createElement('i');
        eliminar.classList.add('bi', 'bi-trash3-fill', 'icono-eliminar');
        eliminar.addEventListener('click', tareaEliminada);

        iconos.append(completar, editar, eliminar);

        if (tarea.completada) {
            editar.remove();
        }

        listaDeTarea.appendChild(tareaNueva);
    });

    actualizarConteo();
    actualizarCompletadas();
}

document.addEventListener('click', (e) => {
    if (
        e.target.classList.contains('icono-eliminar') ||
        e.target.classList.contains('icono-editar') ||
        e.target.classList.contains('icono-completar')
    ) {
        guardarTareas();
    }
});