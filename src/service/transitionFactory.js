import { win } from 'utility/globals';

const factoryMaker = (obj) => {
  return (cb) => {
    obj.complete = cb;
    return obj;
  };
};

/* jshint camelcase: false */
export const transitionFactory = {
  npsMobile: {
    in: factoryMaker({
      fromPosition: [0, win.innerHeight, 0],
      position: [0, 0, 0],
      easing: 'easeOut'
    }),
    out: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, win.innerHeight, 0],
      easing: 'easeIn'
    })
  },
  npsDesktop: {
    in: factoryMaker({
      fromPosition: [0, win.innerHeight, 0],
      position: [0, 0, 0],
      easing: 'easeOut',
      delay: 0
    }),
    out: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, win.innerHeight, 0],
      easing: 'easeIn'
    })
  },
  webWidget: {
    in: factoryMaker({
      fromPosition: [0, 15, 0],
      position: [0, 0, 0],
      easing: 'ease'
    })
  }
};
