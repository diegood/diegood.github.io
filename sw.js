self.addEventListener('install', e=> {
    console.log('se instala', e)
})


self.addEventListener('activate', e => {
    console.log('se activo', e)
})

self.addEventListener('fetch', e => {
    console.log( 'fetch: ')
    console.log( e.request)

})

self.addEventListener('push', e => {
    console.log('mandaron una push', e)

})