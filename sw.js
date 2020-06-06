const CACHE_STATIC_NAME = 'static-v3';
const CACHE_INMUTABLE_NAME ='inmutable-v3';
const CACHE_DYNAMIC_NAME = 'dynamic-v3';

self.addEventListener('install', e=> {
    // console.log('se instala', e)


    self.skipWaiting();

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache =>{
        return cache.addAll([
                    '/index.html', 
                    '/css/estilos.css', 
                    '/js/main.js',
                    '/js/api.js', 
                    '/plantatilla-lista.hbs']
        )
    })

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cache =>{
        return cache.addAll([
                    '/js/handlebars.min-v4.7.6.js',
                    'https://code.getmdl.io/1.3.0/material.light_blue-deep_purple.min.css',
                    'https://code.getmdl.io/1.3.0/material.min.js',
                    'https://code.jquery.com/jquery-3.5.1.min.js'
                ]
        )
    })

    //es algo asi como un Await  basicamente espera lo que esta adentro para seguir con el install
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]))
})


self.addEventListener('activate', e => {
    console.log('se activo', e)

    const cacheWhiteList = [CACHE_STATIC_NAME, CACHE_INMUTABLE_NAME, CACHE_DYNAMIC_NAME]
    e.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys.map(cacheName =>{
                    console.log(cacheName)
                    if(!cacheWhiteList.includes(cacheName)){return caches.delete(cacheName)}
                })
            )
        })
    )
})

self.addEventListener('fetch', e => {
    if(e.request.method == 'GET' && !e.request.url.includes('api')){
        const respuesta = caches.match(e.request).then(res =>{
            if(res){
                console.log('existe en el cache:', e.request.url)
                return res
            }
            console.log('NO existe en el cache:', e.request.url)
            return fetch(e.request).then(newResouce => {
                caches.open(CACHE_DYNAMIC_NAME).then(cache=>{
                    cache.put(e.request, newResouce)
                })
                return newResouce.clone()
            })
        })
        
        e.respondWith(respuesta)
    }else{
        console.log('bypass', e.request.method, e.request.url)
    }

    // caches.open('recursos').then(cache =>{
    //     cache.add(e.request)
    // })


    // e.respondWith(fetch(e.request))

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