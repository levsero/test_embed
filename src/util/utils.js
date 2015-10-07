import _     from 'lodash';
import Color from 'color';

import { document as doc,
         location }       from 'utility/globals';
import { getSizingRatio } from 'utility/devices';
import { mediator }  from 'service/mediator';

let clickBusterClicks = [];

function generateUserCSS(params) {
  if (params.color) {
    const  highlightColor = generateHighlightColor(params.color);

    return (`
      .rf-CheckboxGroup__checkbox:checked + span:before,
      .u-userTextColor:not([disabled]) {
        color: ${params.color} !important;
        fill: ${params.color} !important;
      }
      .u-userFillColor:not([disabled]) svg {
        fill: ${params.color} !important;
      }
      .u-userTextColor:not([disabled]):hover,
      .u-userTextColor:not([disabled]):active,
      .u-userTextColor:not([disabled]):focus {
        color: ${highlightColor} !important;
        fill: ${highlightColor} !important;
      }
      .u-userBackgroundColor:not([disabled]) {
        background-color: ${params.color} !important;
      }
      .u-userBackgroundColor:not([disabled]):hover,
      .u-userBackgroundColor:not([disabled]):active,
      .u-userBackgroundColor:not([disabled]):focus {
        background-color: ${highlightColor} !important;
      }
      .u-userLinkColor a {
        color: ${params.color} !important;
      }
    `);
  } else {
    return '';
  }
}

function generateConstrastColor(colorStr) {
  try {
    const color = Color(colorStr);
    /* jshint laxbreak: true */
    return (color.luminosity() <= 0.35)
         ? 'white'
         : 'black';
  } catch (e) {
    return;
  }
}

function generateHighlightColor(colorStr) {
  try {
    const color = Color(colorStr);
    /* jshint laxbreak: true */
    return (color.luminosity() > 0.15)
       ? color.darken(0.1).rgbString()
       : color.lighten(0.15).rgbString();
  } catch (e) {
    return;
  }
}

function metaStringToObj(str) {
  if (_.isEmpty(str)) {
    return {};
  } else {
    return _.chain(str.split(','))
      .reduce(function(res, item) {
        const pair = item.trim().split('=');
        res[pair[0]] = pair[1];
        return res;
      }, {})
      .value();
  }
}

function metaObjToString(obj) {
  return _.chain(obj)
    .map(function(v, k) { return k + '=' + v; })
    .value()
    .join(', ');
}

function initViewportMeta(active) {
  const viewportMetas = doc.querySelectorAll('meta[name="viewport"]');

  if (viewportMetas.length > 0) {
    return _.last(viewportMetas);
  } else if (active) {
    const newViewportMeta = doc.createElement('meta');
    newViewportMeta.setAttribute('name', 'viewport');
    newViewportMeta.setAttribute('content', '');
    doc.head.appendChild(newViewportMeta);
    return newViewportMeta;
  }
}

function setScaleLock(active) {
  let viewportObj;
  const meta = initViewportMeta(active);

  if (meta) {
    viewportObj = metaStringToObj(meta.getAttribute('content'));

    if (active) {
      if (_.isUndefined(viewportObj['user-scalable'])) {
        viewportObj['original-user-scalable'] = 'UNDEFINED';
        viewportObj['user-scalable'] = 'no';
      } else if (!viewportObj['original-user-scalable']) {
        viewportObj['original-user-scalable'] = viewportObj['user-scalable'];
        viewportObj['user-scalable'] = 'no';
      }

      setTimeout(function() {
        mediator.channel.broadcast('.updateZoom', getSizingRatio(true));
      }, 0);

    } else {
      if (viewportObj['original-user-scalable']) {
        if (viewportObj['original-user-scalable'] === 'UNDEFINED') {
          delete viewportObj['user-scalable'];
        } else {
          viewportObj['user-scalable'] = viewportObj['original-user-scalable'];
        }
        delete viewportObj['original-user-scalable'];
      }
    }

    meta.setAttribute('content', metaObjToString(viewportObj));
  }
}

function parseUrl(url) {
  const anchor = document.createElement('a');
  anchor.href = url;

  return anchor;
}

/**
 * Given a URL/path extract the words on it splitting by common symbols (/, -, _, .)
 *
 * @param  {string}  path   The URL/path e.g. "domain.com/foo/bar.index.html"
 * @return {string}         The split string
 */
function splitPath(path) {
  return decodeURIComponent(path)
          .replace(/\.[^.]{1,4}$/, '')
          .replace(/[\/\.\|_\-]/g, ' ');
}

function clickBusterRegister(x, y) {
  clickBusterClicks.push([x, y]);
}

function clickBusterHandler(ev) {
  let x, y;
  const radius = 25 * getSizingRatio();

  if (clickBusterClicks.length) {
    [x, y] = clickBusterClicks.pop();
    if (Math.abs(x - ev.clientX) < radius &&
        Math.abs(y - ev.clientY) < radius) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }
}

function getFrameworkLoadTime() {
  let entry;
  const now = Date.now();
  let loadTime = document.t ? now - document.t : undefined;

  // https://bugzilla.mozilla.org/show_bug.cgi?id=1045096
  try {
    if ('performance' in window && 'getEntries' in window.performance) {
      entry = _.find(window.performance.getEntries(), function(entry) {
        return entry.name.indexOf('main.js') !== -1;
      });

      if (entry && entry.duration) {
        loadTime = entry.duration;
      }
    }
  } catch (e) {}

  return loadTime >= 0 ? loadTime : undefined;
}

function getPageKeywords() {
  return splitPath(location.pathname).trim();
}

export {
  parseUrl,
  setScaleLock,
  clickBusterRegister,
  clickBusterHandler,
  metaStringToObj,
  getFrameworkLoadTime,
  generateUserCSS,
  getPageKeywords,
  splitPath,
  generateHighlightColor,
  generateConstrastColor
};
