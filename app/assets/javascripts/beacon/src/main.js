import { sendData } from './backend';
import { getBuid, store, retrieve, parseUrl, win, document } from './utils';

var url = location.origin;
var now = Date.now();
var buid = getBuid();
var referrer = parseUrl(document.referrer);
var previousTime = retrieve('currentTime', 'session') || 0;
var beacon = function(opts) {
    url = opts.url || '';

    sendData(opts, function(response) {
        console.log(response);
    });
};

store('currentTime', now, 'session');
if(referrer.origin === url && previousTime) {
    var timeOnLastPage = (now - previousTime);
}

beacon({
    url: location.href,
    buid: buid,
    useragent: navigator.userAgent,
    referrer: referrer.href,
    time: timeOnLastPage ? timeOnLastPage : 0,
    metrics: ['beacon']
});

win.Zd = module.exports = {
    buid: buid
};

