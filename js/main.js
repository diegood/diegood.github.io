console.log('inicia la app')

let dialog = document.querySelector('dialog');
let crearLista = true
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

    $.get('plantatilla-lista.hbs', source =>{
        const template = Handlebars.compile(source)
        let data = {"listaProductos" : listaProductos}
        $('#lista').html(template(data))
    
        let ul = $('#contenedor-lista')
        componentHandler.upgradeElements(ul);
    })


    // fetch('plantatilla-lista.hbs')
    //     .then(res => res.text())
    //     .then( source => {
    //             console.log(source)
    //             const template = Handlebars.compile(source)
    //             let data = {"listaProductos" : listaProductos}
    //             $('#lista').html(template(data))
            
    //             let ul = $('#contenedor-lista')
    //             componentHandler.upgradeElements(ul);
    //         }
    //     )


    // let xhr = new XMLHttpRequest
    // xhr.open('get', 'plantatilla-lista.hbs')
    // xhr.send()
    // xhr.addEventListener('load', () =>{
    //     if(xhr.status == 200){
    //         let source = xhr.response
    //         const template = Handlebars.compile(source)
    //         let data = {"listaProductos" : listaProductos}
    //         $('#lista').html(template(data))
        
    //         let ul = $('#contenedor-lista')
    //         componentHandler.upgradeElements(ul);
    //     }
    // })

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