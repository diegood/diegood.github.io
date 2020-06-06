
const api = (function(){

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

    async function deleteAllProductos(callBack){
        let porcentaje = 0;
        let progress = $('progress')
        progress.show();
        progress.val(progress);
        await listaProductos.forEach(async (prod, i)=>{
            porcentaje = parseInt((i+100)/ listaProductos.length)
            try {
                let p = await $.ajax({url: getURL()+ prod.id, method: 'delete'})
                progress.val(porcentaje);
                console.log('producto borrado', p)
            } catch (error) {
                callBack(error)
            }
            progress.val(100);
            progress.hide();
        })
        callBack('ok')
        
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


    return{
        getProdWeb,
        addProductoApi,
        updateProductoApi,
        deleteAllProductos,
        deleteProductoApi
    }


})()