
// {"publicKey":"BEJ8CatRMAfn6MV9RHmW1KwlhAbrLNP5pvRfvqSSgenpNzv1J3txD0RWPjq8DImddJNIPmeIUrf8Gu9OGyJHrY0","privateKey":"XaNqZnabHyzyilqWhDmKs60RXwLtoAeXN3FJfOuPGQM"};


//  { "endpoint": "https://fcm.googleapis.com/fcm/send/cFYpJ8HcBvI:APA91bHlEtOlLo0DbqpF2GIe7liRX_AjYDAEAD-TQJD2IhIV9_s0by94YnO_n3j3I7mVI9e6J34Zv9ttvZwozvMdagbhyz3elhOLQ8L56vsj2-_-5gUpcesigAWbLGN1B95JgTaKh9_G", "expirationTime": null, 
//  "keys": { "p256dh": "BIg2IYd9hJAAF5VN1Xtm1LZLRRL4byGEhDcQTbWeJZTgFq_RFcr55g_TkEZdLcOl-RfXCSsGI7KSIrBprk2mw6s", "auth": "DEQAx_7tJSW-rfeTrXiBxg" } }

// web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/cFYpJ8HcBvI:APA91bHlEtOlLo0DbqpF2GIe7liRX_AjYDAEAD-TQJD2IhIV9_s0by94YnO_n3j3I7mVI9e6J34Zv9ttvZwozvMdagbhyz3elhOLQ8L56vsj2-_-5gUpcesigAWbLGN1B95JgTaKh9_G" --key="BIg2IYd9hJAAF5VN1Xtm1LZLRRL4byGEhDcQTbWeJZTgFq_RFcr55g_TkEZdLcOl-RfXCSsGI7KSIrBprk2mw6s" --auth="DEQAx_7tJSW-rfeTrXiBxg" --payload="HOLIS!!! COMO ESTAS!!!! 123" --ttl=0 --vapid-subject="mailto: danielsanchez68@hotmail.com" --vapid-pubkey="BEJ8CatRMAfn6MV9RHmW1KwlhAbrLNP5pvRfvqSSgenpNzv1J3txD0RWPjq8DImddJNIPmeIUrf8Gu9OGyJHrY0" --vapid-pvtkey="XaNqZnabHyzyilqWhDmKs60RXwLtoAeXN3FJfOuPGQM"

// node src/cli send-notification

const applicationServerPublicKey = 'BEJ8CatRMAfn6MV9RHmW1KwlhAbrLNP5pvRfvqSSgenpNzv1J3txD0RWPjq8DImddJNIPmeIUrf8Gu9OGyJHrY0'

let pushButton = null;
let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    //console.log(outputArray)
    return outputArray;
}


function updateBtn() {
    if (isSubscribed) {
        pushButton.textContent = 'DesHabilitar Notificaciones Push';
    } else {
        pushButton.textContent = 'Habilitar Notificaciones Push';
    }

    pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}


function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log('User is subscribed:', subscription);

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}


function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function () {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
}


function initialiseUI(reg) {

    swRegistration = reg;

    pushButton = document.querySelector('.js-push-btn');

    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}