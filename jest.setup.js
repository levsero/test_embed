import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';

jest.mock('translation/ze_localeIdMap');

jest.mock('component/Refocus');
jest.mock('src/embed/webWidget/webWidgetStyles');
jest.mock('src/embed/launcher/launcherStyles');
jest.mock('src/embed/sharedStyles');
jest.mock('globalCSS');
jest.mock('@zendesk/client-i18n-tools');

window.I18N = { translations: {} };
global.noop = () => {};

// setup needed for react-slick mocks
window.matchMedia =
window.matchMedia ||
function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

window.requestAnimationFrame =
window.requestAnimationFrame ||
function(callback) {
  setTimeout(callback, 0);
};

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').'); // eslint-disable-line no-console
});
