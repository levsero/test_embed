var anchor = document.createElement('a');

function parseUrl(url) {
  anchor.href = url;

  return anchor;
}

export { parseUrl };
