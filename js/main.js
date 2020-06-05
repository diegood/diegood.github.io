console.log('inicia la app')

let dialog = document.querySelector('dialog');
let crearLista = true
let listaProductos = [
    // { nombre: 'Pan', cantidad: 2, precio: 12.34 },
    // { nombre: 'Carne', cantidad: 3, precio: 54.13 },
    // { nombre: 'Leche', cantidad: 4, precio: 22.32 },
    // { nombre: 'Fideos', cantidad: 4, precio: 78.34 }
]

function guardarListaProductosLocal(lista){
    let productos = JSON.stringify(lista)
    localStorage.setItem('lista', productos)
}

function leerListaProductosLocal(){
    let lista = []
    if(localStorage.getItem('lista')){
        lista = JSON.parse(localStorage.getItem('lista'))
    }
    return lista
}

function getURL(){
    return 'https://5ed19a894e6d7200163a0a2b.mockapi.io/lista/'
}

function getProdWeb(callBack){
    let url = getURL()+'?'+Date.now()
    $.ajax({url: url, method: 'get' })
    .then(callBack)
    .catch(e => {
        console.log(e)
        callBack(leerListaProductosLocal())
    })
}


function deleteProductoApi(id, callBack){
    let url = getURL()+id
    $.ajax({url: url, method: 'delete' })
    .then(callBack)
    .catch(e => {
        console.log(e)
        callBack()
    })
}
function updateProductoApi(id, producto, callBack){
    let url = getURL()+id
    $.ajax({url: url, data: producto  ,method: 'put' })
    .then(callBack)
    .catch(e => {
        console.log(e)
        callBack()
    })
}

function addProductoApi( producto, callBack){
    let url = getURL()
    $.ajax({url: url, data: producto  ,method: 'post' })
    .then(callBack)
    .catch(e => {
        console.log(e)
        callBack()
    })
}


function borrarProducto(id) {
    console.log(listaProductos);
    deleteProductoApi(id, prod =>{
        renderLista()
        console.log('delete:', prod)
    })
    // listaProductos.splice(index, 1);
}


function cambiarCantidad(id, e) {
    let cantidad = Number( $(e).val())
    let index = listaProductos.findIndex(p => p.id == id)

    listaProductos[index].cantidad = cantidad
    let producto = listaProductos[index]

    updateProductoApi(id, producto, ()=>{
        console.log('update cantidad', producto)
        renderLista()
    })
}

function cambiarPrecio(id, e) {
    let precio = $(e).val()
    let index = listaProductos.findIndex(p => p.id == id)
    listaProductos[index].precio = precio
    let producto = listaProductos[index]
    
    updateProductoApi(id, producto, ()=>{
        console.log('update cantidad', producto)
        renderLista()
    })
}


function configurarlistners() {
    $('#btn-entrada-producto').click(() => {
        // comprabar que no sea null el input y armar bien el objeto
        let nombreProducto= $('#ingreso-producto').val()
        if(!nombreProducto){
            dialog.showModal()
        }else{
            // listaProductos.push({ nombre: nombreProducto, cantidad: 1, precio:0 })
            let producto = { nombre: nombreProducto, cantidad: 1, precio:0 }
            addProductoApi(producto, prod =>{
                console.log(prod)
            })
            $('#ingreso-producto').val(null)
            renderLista()
        }
    })
    $('#btn-borrar-lista').click(() => {
        deleteAllProductos(info => {
            console.log(info)
            renderLista()
        })
    })
    dialog.querySelector('.close').click( function () {
        dialog.close();
    });
}

async function deleteAllProductos(callBack){
    await listaProductos.forEach(async (prod)=>{
        try {
            let p = await $.ajax({url: getURL()+ prod.id, method: 'delete'})
            console.log('producto borrado', p)
        } catch (error) {
            callBack(error)
        }
    })
    callBack('ok')
}


function renderLista() {

    $.ajax({url: 'plantatilla-lista.hbs', method : 'get'})
    .then(source =>{
        const template = Handlebars.compile(source)

        getProdWeb(productos =>{
            listaProductos = productos
            guardarListaProductosLocal(listaProductos)
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