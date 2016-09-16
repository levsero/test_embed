const mockTransitionFactory = {
  npsMobile: jasmine.createSpyObj('npsMobile', ['upShow', 'downHide', 'initial']),
  npsDesktop: jasmine.createSpyObj('npsDesktop', ['upShow', 'downHide', 'initial']),
  ipm: jasmine.createSpyObj('ipm', ['upHide', 'downShow', 'initial']),
  webWidget: jasmine.createSpyObj(
    'webWidget',
    [
      'upShow',
      'upHide',
      'downHide',
      'downShow',
      'close',
      'launcherUpShow',
      'launcherDownHide',
      'initial'
    ])
};

exports.mockTransitionFactory = mockTransitionFactory;
