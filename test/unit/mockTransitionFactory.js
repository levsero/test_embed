const mockTransitionFactory = {
  npsMobile: jasmine.createSpyObj('npsMobile', ['upShow', 'downHide']),
  npsDesktop: jasmine.createSpyObj('npsDesktop', ['upShow', 'downHide']),
  webWidget: jasmine.createSpyObj(
    'webWidget',
    [
      'upShow',
      'upHide',
      'downHide',
      'downShow',
      'leftHide',
      'rightShow',
      'close',
      'leftShow',
      'rightHide',
      'launcherUpShow',
      'launcherDownHide'
    ])
};

exports.mockTransitionFactory = mockTransitionFactory;
