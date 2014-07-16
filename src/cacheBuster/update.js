var script = document.createElement('script');

script.src='main.js';

if (location.hash !== '#DONE') { 
  location.hash = 'DONE'; 
  location.reload(true);
}
else { 
  document.body.appendChild(script);
  window.addEventListener('load', function() {
    parent.postMessage('cache_bust_done', '*');
  });
}
