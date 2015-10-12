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
      easing: 'easeOut',
      springConstant: 0.5,
      springDeacceleration: 0.55,
    }),
    out: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, win.innerHeight, 0],
      easing: 'easeIn',
      springConstant: 0.5,
      springDeacceleration: 0.55
    })
  },
  npsDesktop: {
    in: factoryMaker({
      fromPosition: [0, win.innerHeight, 0],
      position: [0, 0, 0],
      easing: 'easeOut',
      springConstant: 0.5,
      springDeacceleration: 0.55,
      delay: 0
    }),
    out: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, win.innerHeight, 0],
      easing: 'easeIn',
      springConstant: 0.5,
      springDeacceleration: 0.55
    })
  },
  webWidget: {
    in: factoryMaker({
      fromPosition: [0, 15, 0],
      position: [0, 0, 0],
      easing: 'ease',
      springConstant: 0.5,
      springDeacceleration: 0.75
    })
  }
};
