import { updateFrameCtx } from 'utility/utils';

var win = updateFrameCtx ? window : window.top,
    document = win.document, /* jshint ignore:line */
    navigator = win.navigator, /* jshint ignore:line */
    location = win.location; /* jshint ignore:line */

export { win, document, navigator, location };

