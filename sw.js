self.addEventListener('install', e=> {
    console.log('se instala', e)
})


self.addEventListener('activate', e => {
    console.log('se activo', e)
})

self.addEventListener('fetch', e => {
    console.log('sw fetch')
    // let url = e.request.url
    // let respuesta

    // if(url.includes('estilos.css')){
    //     console.log('estilo')
    //     // capturo el archivo de estilos.css  y mando otro en su lugar
    //     // respuesta = new Response(
    //     //                 `body{background-color: red;}`,
    //     //                 { headers: { 'content-type' : 'text/css' } }
    //     //             )
    //     respuesta = fetch(url)

    // }
    // else if(url.includes('material.light_blue-deep_purple')){
    //     respuesta = fetch('https://code.getmdl.io/1.3.0/material.indigo-pink.min.css')
    // } 
    // else if(url.includes('super.jpg')){
    //     respuesta = fetch('images/coto.jpg')
    // } 
    // else{
    //     respuesta = fetch(url) 
    // }

    // e.respondWith(respuesta)

})















self.addEventListener('push', e => {
    console.log('mandaron una push', e)

})