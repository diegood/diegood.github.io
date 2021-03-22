

let dialog = document.querySelector('dialog');
let crearLista = true
let listaProductos = []

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

function borrarProducto(id) {
    console.log(listaProductos);
    api.deleteProductoApi(id, prod =>{
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

    api.updateProductoApi(id, producto, ()=>{
        console.log('update cantidad', producto)
        renderLista()
    })
}

function cambiarPrecio(id, e) {
    let precio = $(e).val()
    let index = listaProductos.findIndex(p => p.id == id)
    listaProductos[index].precio = precio
    let producto = listaProductos[index]
    
    api.updateProductoApi(id, producto, ()=>{
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
            api.addProductoApi(producto, prod =>{
                console.log(prod)
            })
            $('#ingreso-producto').val(null)
            renderLista()
        }
    })
    $('#btn-borrar-lista').click(() => {
        api.deleteAllProductos(info => {
            console.log(info)
            renderLista()
        })
    })
    dialog.querySelector('.close').click( function () {
        dialog.close();
    });
}




function renderLista() {

    $.ajax({url: 'plantatilla-lista.hbs', method : 'get'})
    .then(source =>{
        const template = Handlebars.compile(source)

        api.getProdWeb(productos =>{
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
    if(window.caches){
        if('serviceWorker' in navigator){
            window.addEventListener('load', () => {
                this.navigator.serviceWorker.register('./sw.js').then(
                    (reg)=>{
                        console.log('el Service worker se registro correctamente')
                        reg.onupdatefound= () =>{
                            const installingWorker = reg.installin
                            installingWorker.onstatechange = () =>{
                                if(installingWorker.state == 'activated' && this.navigator.serviceWorker.controller){
                                    this.console.log('REINICIANDO');
                                    this.setTimeout(() => {
                                        this.location.reload()
                                    }, 1000);
                                }
                            }
                        }
                    }
                ).catch(()=>{
                    console.warn('Error al reguistar el Service worker')
                })
            })
        }
    }
}

function start(){
    renderLista()
    configurarlistners()
    registrarServiceWorker()
    // pruebaCache()
}

$(document).ready(start)

// Prueba cache storage

function pruebaCache(){
    if(window.caches){
        caches.open('prueba-1');
        caches.open('prueba-2');
        caches.open('prueba-3');
        // caches.has('prueba-3').then(console.log)
        caches.delete('prueba-1').then(console.log)
        caches.keys().then(console.log)
        caches.open('prueba-v1.1').then(cache =>{
            // cache.add('index.html')
            cache.addAll([
                'index.html', 'css/estilos.css', 'images/super.jpg'
            ]).then(()=>{
                console.log('recursos agregados')
                cache.delete('css/estilos.css')
                cache.match('index.html').then(res =>{
                    if(res){
                        // res.text().then(console.log)
                    }
                })
            });

            cache.put('index.html', new Response('holaaa'))
            cache.keys().then(console.log)
        })
    }
}