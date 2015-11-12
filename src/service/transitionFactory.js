import { win } from 'utility/globals';

const factoryMaker = (obj) => {
  return (cb) => {
    return Object.assign({}, obj, { complete: cb });
  };
};

export const transitionFactory = {
  npsMobile: {
    in: factoryMaker({
      fromPosition: [0, win.innerHeight, 0],
      position: [0, 0, 0],
      easing: 'easeOut'
    }),
    out: factoryMaker({
      position: [0, win.innerHeight, 0],
      fromPosition: [0, 0, 0],
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
