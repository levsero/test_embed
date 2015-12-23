import { win, navigator } from 'utility/globals';

function getDeviceZoom() {
  const landscape = Math.abs(win.orientation) === 90;
  const screen = win.screen;
  const deviceWidth = landscape ? screen.availHeight : screen.availWidth;

  return deviceWidth / win.innerWidth;
}

function getSizingRatio(isPinching, isFirstRun) {
  const landscape = Math.abs(win.orientation) === 90;
  const ratio = 1 / getDeviceZoom();
  const ratioThreshold = 2;
  let defaultRatio = landscape ? ratioThreshold : 3;

  // On first run check the ratio is below threshold
  // for defaulting to a smaller default font-size for
  // tablets so the button isn't enormous
  if (!isPinching && ratio < ratioThreshold && isFirstRun) {
    defaultRatio = (ratio).toFixed(1);
  }

  // A scale of 3 is a good base if the ratio is smaller
  // Android devices will return a smaller ratio compared
  // to iOS. If loaded in landscape go for 2 ratio.
  // Unless we're triggering this from a gesture then take
  // ratio calculation.

  return (ratio > 1)
    ? Math.max(isPinching ? 0 : defaultRatio, ratio)
    : 1;
}

function isIos() {
  const IOS_MOBILE = /iPhone|iPad|iPod/i;
  const str = navigator.userAgent || navigator.vendor || win.opera;

  return IOS_MOBILE.test(str);
}

function isFirefox() {
  const FIREFOX_BROWSER = /Gecko\/.*\d.*Firefox/;

  return FIREFOX_BROWSER.test(navigator.userAgent);
}

// Taken from Zopim Mobile.js
// Detects mobile and tablet user agents
function isMobileBrowser() {
  /* eslint max-len: 0 */
  const BROWSER_MOBILE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
  const BROWSER_MOBILE_OTHER = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
  const str = navigator.userAgent || navigator.vendor || win.opera;
  const result = BROWSER_MOBILE.test(str) || BROWSER_MOBILE_OTHER.test(str.substr(0, 4));

  return result;
}

function shouldGoFullscreen() {
  return getSizingRatio() && isMobileBrowser();
}

function isBlacklisted() {
  return (
    // Iphone chrome on ios 8.0.x displays a blank space instead of content
    (navigator.userAgent.indexOf('CriOS') !== -1 && navigator.userAgent.indexOf('OS 8_0') !== -1) ||

    // MSIE 9.0
    navigator.userAgent.indexOf('MSIE 9.0') !== -1 ||

    // Googlebot, Googlebot-Mobile, etc. https://support.google.com/webmasters/answer/1061943?hl=en
    navigator.userAgent.indexOf('Googlebot') !== -1 ||

    // If user agent doesn't support CORS blacklist browser
    !('XMLHttpRequest' in win && 'withCredentials' in new win.XMLHttpRequest())
  );
}

function isIE() {
  return (
    // MSIE is present in all IE user agents since IE 2.0
    (navigator.userAgent.indexOf('MSIE') !== -1) ||
    // Trident is IE specific
    (navigator.userAgent.indexOf('Trident') !== -1)
  );
}

export {
  getDeviceZoom,
  getSizingRatio,
  isMobileBrowser,
  shouldGoFullscreen,
  isBlacklisted,
  isIE,
  isIos,
  isFirefox
};

