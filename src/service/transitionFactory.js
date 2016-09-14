import _ from 'lodash';

const factoryMaker = (defaultParams) => {
  return (params) => {
    return _.extend({}, defaultParams, params);
  };
};

const offScreen = (fallback) => {
  return screen.height ? `-${screen.height}px` : fallback
}

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
      top: '-30px'
    }),
    initial: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: 'auto',
      top: offScreen('-20%')
    }),
  },
  webWidget: {
    launcherUpShow: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease',
      opacity: 1,
      bottom: 0
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
      bottom: 0
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
      bottom: 0
    }),
    initial: factoryMaker({
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      top: offScreen('-9999px'),
      bottom: '-30px',
      position: 'absolute'
    })
  }
};
