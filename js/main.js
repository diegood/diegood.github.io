console.log('inicia la app')

let dialog = document.querySelector('dialog');
let crearLista = true
let listaProductos = [
    // { nombre: 'Pan', cantidad: 2, precio: 12.34 },
    // { nombre: 'Carne', cantidad: 3, precio: 54.13 },
    // { nombre: 'Leche', cantidad: 4, precio: 22.32 },
    // { nombre: 'Fideos', cantidad: 4, precio: 78.34 }
]

function getURL(){
    return 'https://5ed19a894e6d7200163a0a2b.mockapi.io/lista/'
}

function getProdWeb(callBack){
    let url = getURL()+'?'+Date.now()
    $.ajax({url: url, method: 'get' })
    .then(callBack)
    .catch(e => {
        console.log(e)
        callBack(listaProductos)
    })
}





function borrarProducto(index) {
    console.log(listaProductos);
    listaProductos.splice(index, 1);
    renderLista()
}
function cambiarCantidad(index, e) {
    let cantidad = Number(e.val())
    listaProductos[index].cantidad = cantidad
    renderLista()
}

function cambiarPrecio(index, e) {
    let precio = Number(e.val())
    listaProductos[index].precio = precio
    renderLista()
}


function configurarlistners() {
    $('#btn-entrada-producto').click(() => {
        // comprabar que no sea null el input y armar bien el objeto
        let nombreProducto= $('#ingreso-producto').val()
        if(!nombreProducto){
            dialog.showModal()
        }else{
            listaProductos.push({ nombre: nombreProducto, cantidad: 1, precio:0 })
            $('#ingreso-producto').val(null)
            renderLista()
        }
    })
    $('#btn-borrar-lista').click(() => {
        listaProductos = []
        renderLista()
    })
    dialog.querySelector('.close').click( function () {
        dialog.close();
    });
}


function renderLista() {

    $.ajax({url: 'plantatilla-lista.hbs', method : 'get'})
    .then(source =>{
        const template = Handlebars.compile(source)

        getProdWeb(productos =>{
            listaProductos = productos
            let data = {"listaProductos" : listaProductos}
            $('#lista').html(template(data))
        
            let ul = $('#contenedor-lista')
            componentHandler.upgradeElements(ul);
        })

    })

}

function registrarServiceWorker(){
    if('serviceWorker' in navigator){
        window.addEventListener('load', () => {
            this.navigator.serviceWorker.register('./sw.js').then(
                (reg)=>{
                    console.log('el Service worker se registro correctamente')
                }
            ).catch(()=>{
                console.warn('Error al reguistar el Service worker')
            })
        })
    }
}

function start(){
    renderLista()
    configurarlistners()
    registrarServiceWorker()
}

$(document).ready(start)