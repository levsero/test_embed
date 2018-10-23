import { isMobileBrowser } from 'utility/devices';
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { getWebWidgetVisible } from 'src/redux/modules/selectors';
import { setScrollKiller,
  setWindowScroll,
  revertWindowScroll } from 'utility/scrollHacks';

export default function onWidgetOpen(prevState, nextState) {
  if (!isMobileBrowser() || getActiveEmbed(nextState) === 'zopimChat') return;

  if (!getWebWidgetVisible(prevState) && getWebWidgetVisible(nextState)) {
    setTimeout(() => {
      setWindowScroll(0);
      setScrollKiller(true);
    }, 0);
  } else {
    setScrollKiller(false);
    revertWindowScroll();
  }
}
