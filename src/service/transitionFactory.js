import { win } from 'utility/globals';

const factoryMaker = (obj) => {
  return (cb) => {
    obj.callback = cb;
    return obj;
  };
};

export const transitionFactory = {
  npsMobile: {
    in: factoryMaker({
      /* jshint camelcase: false */
      from_position: [0, win.innerHeight, 0],
      position: [0, 0, 0],
      easing: 'spring',
      spring_constant: 0.5,
      spring_deacceleration: 0.55
    }),
    out: factoryMaker({
      /* jshint camelcase: false */
      from_position: [0, 0, 0],
      position: [0, win.innerHeight, 0],
      easing: 'spring',
      spring_constant: 0.5,
      spring_deacceleration: 0.55
    })
  },
  npsDesktop: {
    in: factoryMaker({
      /* jshint camelcase: false */
      from_position: [-310, win.innerHeight, 0],
      position: [-310, 0, 0],
      easing: 'spring',
      spring_constant: 0.5,
      spring_deacceleration: 0.55
    }),
    out: factoryMaker({
      /* jshint camelcase: false */
      from_position: [-310, 0, 0],
      position: [-310, win.innerHeight, 0],
      easing: 'spring',
      spring_constant: 0.5,
      spring_deacceleration: 0.55
    })
  },
  webWidget: {
    in: factoryMaker({
      /* jshint camelcase: false */
      from_position: [0, 15, 0],
      position: [0, 0, 0],
      easing: 'spring',
      spring_constant: 0.5,
      spring_deacceleration: 0.75
    })
  }
};
