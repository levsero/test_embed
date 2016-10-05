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
    opacity: 0,
    top: '-9999px'
  }
)

const launcherUpShow = {
  transitionProperty: 'all',
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease',
  opacity: 1,
  bottom: positionWithOffset(0)
}

const launcherDownHide = {
  transitionProperty: 'all',
  transitionTimingFunction: 'linear',
  transitionDuration: '200ms',
  opacity: 0,
  bottom: positionWithOffset(-30)
}

export const transitionFactory = {
  npsMobile: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: '-300px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: '-300px'
      }
    )
  },
  npsDesktop: {
    upShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: '-100px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        bottom: 0
      }
    ),
    downHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in',
        opacity: 0,
        bottom: '-100px'
      }
    )
  },
  ipm: {
    downShow: transitionMaker(
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        top: '-300px'
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 1,
        top: 0
      }
    ),
    upHide: transitionMaker({},
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-out',
        opacity: 0,
        top: '-300px'
      }
    )
  },

  webWidget: {

    launcherUpShow: transitionMaker(launcherDownHide, launcherUpShow),
    launcherDownHide: transitionMaker(launcherUpShow, launcherDownHide),


    launcherDownShow: transitionMaker(
      {
        opacity: 0,
        top: positionWithOffset(-20),
      },
      {
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        opacity: 1,
        top: positionWithOffset(0),
      }
    ),



    launcherUpHide: transitionMaker(
      {},
      {
        transitionProperty: 'all',
        transitionTimingFunction: 'linear',
        transitionDuration: '200ms',
        opacity: 0,
        top: positionWithOffset(-20),
      }
    ),









    downHide: transitionMaker(_.extend(
      {},
      noAnimation,
      {
        opacity: 1,
        bottom: positionWithOffset(400)
      }
    ),
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      bottom: positionWithOffset(-30)
    }),









    downShow: transitionMaker(_.extend(
      {},
      startMargins,
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        top: positionWithOffset(-30)
      }
    ),
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      top: positionWithOffset(0)
     }),













    upHide: transitionMaker({
      transitionProperty: 'none',
      transitionDuration: '0',
      transitionTimingFunction: 'unset',
      opacity: 1,
      top: positionWithOffset(0),
      bottom: 'auto'
    },
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 0,
      top: positionWithOffset(-20),
      bottom: 'auto'
    }),
















    upShow: transitionMaker(_.extend(
      {},
      startMargins,
      {
        transitionProperty: 'none',
        transitionDuration: '0',
        transitionTimingFunction: 'unset',
        opacity: 0,
        bottom: positionWithOffset(-30),
        top: 'auto'
      }
    ),
    {
      transitionProperty: 'all',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-out',
      opacity: 1,
      bottom: positionWithOffset(0),
      top: 'auto'
    })
  },
  hiddenState: factoryMaker(hiddenState)
};
