import _ from 'lodash';
import { isMobileBrowser } from 'utility/devices';
import { settings } from 'service/settings';
// TODO: Re-visit the boot process to avoid this
settings.init();

const webWidetOffset = settings.get('offset.vertical');
const ipmOffset = settings.get('offset.vertical', 'ipm');
const applyHiddenState = (frameHeight, isTop = false) => {
  let topPosition = {};
  const verticalOffset = parseInt(settings.get('offset.vertical'));
  const safetyPadding = 50;

  if (frameHeight > 0 && isTop) {
    topPosition = { top: `-${frameHeight + verticalOffset + safetyPadding}px` };
  }

  return _.extend({}, hiddenState, topPosition);
};

const transitionMaker = (defaultStartParams, defaultEndParams) => {
  return (startParams, endParams) => {
    return {
      start: _.defaults({}, startParams, defaultStartParams),
      end: _.defaults({}, endParams, defaultEndParams)
    };
  };
};

const positionWithOffset = (positionStr, offset = webWidetOffset) => {
  let position = parseInt(positionStr);

  if (!isMobileBrowser()) {
    position += parseInt(offset);
  }

  return `${position}px`;
};

const hiddenState = {
  transitionProperty: 'none',
  transitionDuration: '0',
  transitionTimingFunction: 'unset',
  opacity: 0,
  top: '-9999px'
};

const launcherUpShow = {
  transitionProperty: 'all',
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease',
  opacity: 1,
  bottom: positionWithOffset(0)
};

const launcherDownHide = {
  transitionProperty: 'all',
  transitionTimingFunction: 'linear',
  transitionDuration: '200ms',
  opacity: 0,
  bottom: positionWithOffset(-30)
};

const transitionFactory = {
  npsMobile: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: '-300px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: '-300px'
      }
    )
  },
  npsDesktop: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: '-100px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: '-100px'
      }
    )
  },
  ipm: {
    downShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        top: positionWithOffset(-30, ipmOffset)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        top: positionWithOffset(0, ipmOffset)
      }
    ),
    upHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 0,
        top: positionWithOffset(-30, ipmOffset)
      }
    )
  },
  automaticAnswersMobile: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 1,
        bottom: '-150px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '400ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: 0
      }
    )
  },
  automaticAnswersDesktop: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: '-200px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '500ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: '-200px'
      }
    )
  },
  webWidget: {
    launcherUpShow: transitionMaker(launcherDownHide, launcherUpShow),
    launcherDownHide: transitionMaker(launcherUpShow, launcherDownHide),
    launcherDownShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        top: positionWithOffset(-20)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        opacity: 1,
        top: positionWithOffset(0)
      }
    ),

    launcherUpHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionTimingFunction: 'linear',
        transitionDuration: '200ms',
        opacity: 0,
        top: positionWithOffset(-20)
      }
    ),
    downHide: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 1,
        bottom: positionWithOffset(400)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 0,
        bottom: positionWithOffset(-30)
      }
    ),
    downShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        top: positionWithOffset(-30)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        top: positionWithOffset(0)
      }
    ),
    upHide: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 1,
        top: positionWithOffset(0)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 0,
        top: positionWithOffset(-20)
      }
    ),
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: positionWithOffset(-30)
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: positionWithOffset(0)
      }
    )
  },
  hiddenState: applyHiddenState
};

export {
  applyHiddenState,
  transitionMaker,
  positionWithOffset,
  transitionFactory
};
