let element = null;
let isOnMobile = false;
let onHitHandler = () => {};

// This is a temporary module that will soon be deleted in favour of a more robust widget on-click solution.
// TODO: - Delete this module and all associated references and tests
//       - Remove all traces of mouse driven contextual help logic from the codebase
function target(domElement, onHit, isMobile = false) {
  if (element) return;

  const iframeDoc = domElement.contentDocument
                  || domElement.contentWindow.document;

  element = iframeDoc.getElementById('Embed');
  isOnMobile = isMobile;
  onHitHandler = onHit;
  addListener();

  // Return a handler to the calling code so this event can be cancelled.
  return () => removeListener();
}

function handleClick() {
  onHitHandler();
  removeListener();
}

function addListener() {
  if (isOnMobile) {
    element.addEventListener('touchstart', handleClick);
  } else {
    element.addEventListener('click', handleClick);
  }
}

function removeListener() {
  if (isOnMobile) {
    element.removeEventListener('touchstart', handleClick);
  } else {
    element.removeEventListener('click', handleClick);
  }
}

export const mouse = {
  target
};
