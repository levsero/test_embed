import _ from 'lodash';
import { isMobileBrowser } from 'utility/devices';
import { settings } from 'service/settings';
// TODO: Re-visit the boot process to avoid this
settings.init();

const factoryMaker = (defaultParams) => {
  return (params) => {
    return _.extend({}, defaultParams, params);
  };
};

const transitionMaker = (defaultStartParams, defaultEndParams) => {
  return (startParams, endParams) => {
    return {
      start: _.extend({}, defaultStartParams, startParams),
      end: _.extend({}, defaultEndParams, endParams)
    };
  };
};

const offScreen = (fallback) => {
  return screen.height ? `-${screen.height}px` : fallback;
};

const positionWithOffset = (base) => {
  const position = parseInt(base, 10) + parseInt(settings.get('offset.vertical'), 10);

  return `${position}px`;
};

const marginSetting = () => {
  return isMobileBrowser() ? 0 : settings.get('margin');
}

const startMargins = {
  marginRight: marginSetting(),
  marginLeft: marginSetting()
}

const noAnimation = {
  transitionProperty: 'none',
  transitionDuration: '0',
  transitionTimingFunction: 'unset'
}

const hiddenState = _.extend(
  {},
  noAnimation,
  {
    opacity: .2,
    top: '-9999px',
    bottom: '-30px',
    position: 'absolute'
  }
)

const launcherUp = {
  transitionProperty: 'all',
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease',
  opacity: 1,
  bottom: positionWithOffset(0)
}

const launcherDown = {
  transitionProperty: 'all',
  transitionTimingFunction: 'linear',
  transitionDuration: '200ms',
  opacity: .2,
  bottom: '-70px'
}

export const transitionFactory = {
  // npsMobile: {
  //   upShow: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-out',
  //     opacity: 1,
  //     bottom: 0
  //   }),
  //   downHide: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-in',
  //     opacity: 0,
  //     bottom: '-300px'
  //   }),
  //   initial: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-in',
  //     opacity: 0,
  //     bottom: '-52%',
  //     top: 'auto'
  //   })
  // },
  // npsDesktop: {
  //   upShow: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-out',
  //     opacity: 1,
  //     bottom: 0
  //   }),
  //   downHide: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-in',
  //     opacity: 0,
  //     bottom: '-100px'
  //   }),
  //   initial: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-in',
  //     opacity: 0,
  //     top: '-9999px',
  //     bottom: '-300px'
  //   })
  // },
  // ipm: {
  //   downShow: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-out',
  //     opacity: 1,
  //     bottom: 'auto',
  //     top: 0
  //   }),
  //   upHide: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-out',
  //     opacity: 0,
  //     bottom: 'auto',
  //     top: '-300px'
  //   }),
  //   initial: factoryMaker({
  //     transitionProperty: 'all',
  //     transitionDuration: '300ms',
  //     transitionTimingFunction: 'ease-out',
  //     opacity: 0,
  //     bottom: 'auto',
  //     top: '-300px'
  //   })
  // },







  webWidget: {

    launcherUpShow: transitionMaker(launcherDown, launcherUp),
    launcherDownHide: transitionMaker(launcherUp, launcherDown),










    downHide: transitionMaker(_.extend(
      {},
      noAnimation,
      {
        opacity: 1,
        bottom: positionWithOffset(0)
      }
    ),
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: .2,
      bottom: '-30px'
    }),









    downShow: transitionMaker(_.extend(
      {},
      startMargins,
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: .2,
        bottom: 'auto',
        top: '-30px'
      }
    ),
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: 'auto',
      top: positionWithOffset(0)
     }),













    upHide: transitionMaker({
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
      opacity: .2,
      top: '-30px'
    }),
















    upShow: transitionMaker(_.extend(
      {},
      startMargins,
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: .2,
        bottom: positionWithOffset(-30),
        top: '300px'
      }
    ),
    {
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
  },
  hiddenState: factoryMaker(hiddenState)
};
