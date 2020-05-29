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
            document.getElementById('ingreso-producto').value = null
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
    let xhr = new XMLHttpRequest
    xhr.open('get', 'plantatilla-lista.hbs')
    xhr.send()
    xhr.addEventListener('load', () =>{
        if(xhr.status == 200){
            let source = xhr.response
            const template = Handlebars.compile(source)
            let data = {"listaProductos" : listaProductos}
            let lista = document.getElementById('lista')
            lista.innerHTML = template(data)
        
            let ul = document.getElementById('contenedor-lista')
            componentHandler.upgradeElements(ul);
        }
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

renderLista()
configurarlistners()
registrarServiceWorker()