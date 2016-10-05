import _ from 'lodash';
import { isMobileBrowser } from 'utility/devices';
import { settings } from 'service/settings';
// TODO: Re-visit the boot process to avoid this
settings.init();

const applyHiddenState = (frameHeight) => {
  let topPosition = {};
  const verticalOffset = settings.get('offset.vertical') || 0;
  const safetyPadding = 50;

  if (frameHeight > 0 && settings.get('position.vertical') === 'top') {
    topPosition = { top: `-${frameHeight + verticalOffset + safetyPadding}px` };
  }

  return _.extend({}, hiddenState, topPosition);
};

const transitionMaker = (defaultStartParams, defaultEndParams) => {
  return (startParams, endParams) => {
    return {
      start: _.defaults({}, defaultStartParams, startParams),
      end: _.defaults({}, defaultEndParams, endParams)
    };
  };
};

const positionWithOffset = (positionStr) => {
  let position = parseInt(positionStr);

  if (!isMobileBrowser()) {
    position += parseInt(settings.get('offset.vertical'));
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

export const transitionFactory = {
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
        top: '-300px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        top: 0
      }
    ),
    upHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 0,
        top: '-300px'
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
