import _ from 'lodash';
import { settings } from 'service/settings';
// TODO: Re-visit the boot process to avoid this
settings.init();

const factoryMaker = (defaultParams) => {
  return (params) => {
    return _.extend({}, defaultParams, params);
  };
};

const offScreen = (fallback) => {
  return screen.height ? `-${screen.height}px` : fallback;
};

const positionWithOffset = (base) => {
  const position = parseInt(base, 10) + parseInt(settings.get('offset.vertical'), 10);

  return `${position}px`;
};

export const transitionFactory = {
  npsMobile: {
    upShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: 0
    }),
    downHide: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      opacity: 0,
      bottom: '-300px'
    }),
    initial: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      opacity: 0,
      bottom: '-52%'
    })
  },
  npsDesktop: {
    upShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: 0
    }),
    downHide: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      opacity: 0,
      bottom: '-100px'
    }),
    initial: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      opacity: 0,
      bottom: '-300px'
    })
  },
  ipm: {
    downShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: 'auto',
      top: 0
    }),
    upHide: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: 'auto',
      top: '-300px'
    }),
    initial: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: 'auto',
      top: '-300px'
    })
  },
  webWidget: {
    launcherUpShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease',
      opacity: 1,
      bottom: positionWithOffset(0)
    }),
    launcherDownHide: factoryMaker({
      transitionProperty: 'all',
      transitionTimingFunction: 'linear',
      transitionDuration: '200ms',
      opacity: 0,
      bottom: '-70px'
    }),
    downHide: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: '-30px'
    }),
    downShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: positionWithOffset(0)
    }),
    upHide: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: '30px'
    }),
    upShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: positionWithOffset(0)
    }),
    initial: factoryMaker({
      transitionProperty: 'none',
      transitionDuration: '0',
      transitionTimingFunction: 'unset',
      opacity: 0,
      top: offScreen('-9999px'),
      bottom: '-30px',
      position: 'absolute'
    })
  }
};
