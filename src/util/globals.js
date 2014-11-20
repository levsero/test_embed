import { cacheBuster } from 'service/cacheBuster';

var win = cacheBuster.isCacheBusting(window.name) ? window : window.top,
    document = win.document, /* jshint ignore:line */
    navigator = win.navigator, /* jshint ignore:line */
    location = win.location; /* jshint ignore:line */

export { win, document, navigator, location };

