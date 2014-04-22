var win = window.top;
var document = win.document;

export { win, document };

var anchor = document.createElement('a');

function hex() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function generateBuid() {
  return [
    hex(), hex(), hex(), hex(), hex(), hex(), hex(), hex()
  ].join('');
}

function getBuid() {
  var buid = retrieve('buid');

  if(!buid) {
    buid = generateBuid();
    store('buid', buid);
  }

  return buid;
}

function store(name, data, type) {
  type = type || 'local';
  if(typeof data === 'object') {
    data = JSON.stringify(data);
  }
  win[type + 'Storage'].setItem('ZD-'+name, data);
}

function retrieve(name, type) {
  type = type || 'local';
  var item = win[type + 'Storage'].getItem('ZD-' + name);
  try {
    return JSON.parse(item);
  } catch(e) {
    return item;
  }
}

function parseUrl(url) {
  anchor.href = url;

  return anchor;
}

export { getBuid, store, retrieve, parseUrl };
