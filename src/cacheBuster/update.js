var currentVersion = '{{versionHash}}';
if (location.hash !== ('#' + currentVersion)) {
  location.hash = currentVersion;
  location.reload(true);
} else {
  window.addEventListener('load', function() {
    parent.postMessage('cache_bust_done', '*');
  });
}
