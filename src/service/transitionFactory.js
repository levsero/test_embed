import _ from 'lodash';

const factoryMaker = (defaultParams) => {
  return (params) => {
    return _.extend({}, defaultParams, params);
  };
};

export const transitionFactory = {
  npsMobile: {
    upShow: factoryMaker({
      fromPosition: [0, 100, 0],
      position: [0, 0, 0],
      fromOpacity: 0.5,
      duration: 300,
      opacity: 1,
      easing: 'easeOut'
    }),
    downHide: factoryMaker({
      position: [0, 300, 0],
      fromPosition: [0, 0, 0],
      fromOpacity: 0.7,
      duration: 300,
      opacity: 0,
      easing: 'easeIn'
    })
  },
  npsDesktop: {
    upShow: factoryMaker({
      fromPosition: [0, 100, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      duration: 300,
      easing: 'easeOut'
    }),

    downHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, 100, 0],
      opacity: 0,
      fromOpacity: 0.7,
      duration: 300,
      easing: 'easeIn'
    })
  },
  ipm: {
    downShow: factoryMaker({
      fromPosition: [0, -30, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'easeOut',
      duration: 300
    }),
    upHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, -30, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'easeOut',
      duration: 300
    })
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
    })
  }
};
