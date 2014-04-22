function processData(data) {
  return JSON.stringify(data);
}

export function sendData(data, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://zensnow.herokuapp.com/api/blips', true);
  xhr.addEventListener('readystatechange', function(e) {
    if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 300) {
      callback(xhr.responseText);
    }
  }, false);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(processData(data));
}

