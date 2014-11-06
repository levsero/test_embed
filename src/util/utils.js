import { document as doc } from 'utility/globals';
require('imports?_=lodash!lodash');

var clickBusterClicks = [];

function generateUserCSS(params) {
  if (params.color) {
    return (`
      .u-user-textColor:not([disabled]) {
        color: ${params.color} !important;
      }
      .u-user-backgroundColor:not([disabled]) {
        background-color: ${params.color} !important;
      }
    `);
  } else {
    return '';
  }
}

function metaStringToObj(str) {
  if (_.isEmpty(str)) {
    return {};
  } else {
    return _.chain(str.split(','))
      .reduce(function(res, item) {
        var pair = item.trim().split('=');
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
  var newViewportMeta,
      viewportMetas = doc.querySelectorAll('meta[name="viewport"]');

  if (viewportMetas.length > 0) {
    return _.last(viewportMetas);
  }

  else if (active) {
    newViewportMeta = doc.createElement('meta');
    newViewportMeta.setAttribute('name', 'viewport');
    newViewportMeta.setAttribute('content', '');
    doc.head.appendChild(newViewportMeta);
    return newViewportMeta;
  }
}

function setScaleLock(active) {
  var meta = initViewportMeta(active),
      viewportObj;

  if (meta) {
    viewportObj = metaStringToObj(meta.getAttribute('content'));

    if (active) {
      if (_.isUndefined(viewportObj['user-scalable'])) {
        viewportObj['original-user-scalable'] = 'UNDEFINED';
        viewportObj['user-scalable'] = 'no';
      }
      else if (!viewportObj['original-user-scalable']) {
        viewportObj['original-user-scalable'] = viewportObj['user-scalable'];
        viewportObj['user-scalable'] = 'no';
      }
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
  var anchor = document.createElement('a');
  anchor.href = url;

  return anchor;
}

function clickBusterRegister(x, y) {
  clickBusterClicks.push([x, y]);
}

function clickBusterHandler(ev) {
  var x, y;

  if (clickBusterClicks.length) {
    [x, y] = clickBusterClicks.pop();
    if (Math.abs(x - ev.clientX) < 25 &&
        Math.abs(y - ev.clientY) < 25) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }
}

function getFrameworkLoadTime() {
  var now = Date.now(),
      loadTime = document.t ? now - document.t : undefined;

  if('performance' in window && 'getEntries' in window.performance) {
    loadTime = _.find(window.performance.getEntries(), function(entry) {
      return entry.name.indexOf('main.js') !== -1;
    }).duration;
  }

  return loadTime < 0 ? undefined : loadTime;
}

export {
  parseUrl,
  setScaleLock,
  clickBusterRegister,
  clickBusterHandler,
  metaStringToObj,
  getFrameworkLoadTime,
  generateUserCSS
};
