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
      fromPosition: [0, 30, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    out: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, 30, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    leftHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [-30, 0, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    leftShow: factoryMaker({
      fromPosition: [30, 0, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    rightShow: factoryMaker({
      fromPosition: [-30, 0, 0],
      position: [0, 0, 0],
      fromOpacity: 0,
      opacity: 1,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    rightHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [30, 0, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    }),
    downHide: factoryMaker({
      fromPosition: [0, 0, 0],
      position: [0, 30, 0],
      fromOpacity: 1,
      opacity: 0,
      easing: 'spring',
      springConstant: 1.5,
      springDeceleration: 0.60,
      springMass: 35
    })
  }
};
