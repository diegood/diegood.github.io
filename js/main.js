console.log('inicia la app')

let dialog = document.querySelector('dialog');
let crearLista = true
let ul
let listaProductos = [
    { nombre: 'Pan', cantidad: 2, precio: 12.34 },
    { nombre: 'Carne', cantidad: 3, precio: 54.13 },
    { nombre: 'Leche', cantidad: 4, precio: 22.32 },
    { nombre: 'Fideos', cantidad: 4, precio: 78.34 }
]
function borrarProducto(index) {
    console.log(listaProductos);
    listaProductos.splice(index, 1);
    renderLista()
}
function cambiarCantidad(index, e) {
    let cantidad = Number(e.value)
    listaProductos[index].cantidad = cantidad
    renderLista()
}

function cambiarPrecio(index, e) {
    let precio = Number(e.value)
    listaProductos[index].precio = precio
    renderLista()
}


function configurarlistners() {
    document.getElementById('btn-entrada-producto').addEventListener('click', (e) => {
        // comprabar que no sea null el input y armar bien el objeto
        let nombreProducto= document.getElementById('ingreso-producto').value
        if(!nombreProducto){
            dialog.showModal()
        }else{
            listaProductos.push({ nombre: nombreProducto, cantidad: 1, precio:0 })
            nombreProducto = null
            renderLista()
        }
    })
    document.getElementById('btn-borrar-lista').addEventListener('click', (e) => {
        listaProductos = []
        renderLista()
    })
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}


function renderLista() {
    if (crearLista) {
        ul = document.createElement('ul')
        ul.classList.add('demo-list-icon', 'mdl-list', 'w-100')
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
    }

    ul.innerHTML = ''
    listaProductos.forEach((p, index) => {
        ul.innerHTML +=
            `
                <li class="mdl-list__item w-100" >
                    <span class="mdl-list__item-primary-content w-10">
                        <i class="material-icons">shopping_cart</i>
                    </span>
                    <span class="mdl-list__item-primary-content w-30">
                        ${p.nombre}
                    </span>
                    <span class="mdl-list__item-primary-content w-30">
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input type="number" class="mdl-textfield__input" type="text" onchange="cambiarCantidad(${index}, this)" id="input-cantidad-${index}">
                            <label class="mdl-textfield__label" for="input-cantidad-${index}">${p.cantidad}</label>
                        </div>
                    </span>
                    <span class="mdl-list__item-primary-content w-20 ml-item">
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input type="number class="mdl-textfield__input" type="text" onchange="cambiarPrecio(${index}, this)" id="input-precio-${index}">
                            <label class="mdl-textfield__label" for="input-precio-${index}">${p.precio}</label>
                        </div>
                    </span>
                    <span class="mdl-list__item-primary-content w-10">
                        <button onclick="borrarProducto(${index})" class="mdl-button mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">delete</i>
                        </button>
                    </span>
                </li>
            `
    })

    if (crearLista) {
        document.getElementById('lista').appendChild(ul)
    } else {
        componentHandler.upgradeElements(ul);
    }
    crearLista = false

}

renderLista()
configurarlistners()