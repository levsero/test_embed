import { sendData } from './backend';

var url = location.origin;
var beacon = function(opts) {
    url = opts.url || '';

    sendData(opts, function(response) {
        console.log(response);
    });
};

setTimeout(function(){
    beacon({
        name: 'ZendeskBeacon',
        url: url,
        useragent: navigator.userAgent,
        referrer: document.referrer,
        time: window.performance.now(),
        metrics: window.performance.getEntriesByName(url + '/dist/main.js')
    });
}, 1000);

