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
  webWidget: {
    launcherUpShow: factoryMaker({
      fromPosition: [0, 120, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'easeOut',
      duration: 500
    }),

    launcherDownHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, 120, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'linear',
      duration: 200
    }),

    downHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, 30, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'easeOut',
      duration: 300
    }),

    downShow: factoryMaker({
      fromPosition: [0, -30, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'easeOut',
      duration: 300
    }),

    leftHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [-30, 0, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'easeOut',
      duration: 300
    }),

    leftShow: factoryMaker({
      fromPosition: [30, 0, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'easeOut',
      duration: 300
    }),

    rightShow: factoryMaker({
      fromPosition: [-30, 0, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'easeOut',
      duration: 300
    }),

    rightHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [30, 0, 0],
      fromOpacity: 1,
      opacity: 0,
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
    }),

    upShow: factoryMaker({
      fromPosition: [0, 30, 0],
      position: [0, 0, 0],
      fromOpacity: 0.5,
      opacity: 1,
      easing: 'easeOut',
      duration: 300
    })

  }
};
