const mockTransitionFactory = {
  npsMobile: jasmine.createSpyObj('npsMobile', ['upShow', 'downHide']),
  npsDesktop: jasmine.createSpyObj('npsDesktop', ['upShow', 'downHide']),
  ipm: jasmine.createSpyObj('ipm', ['upHide', 'downShow']),
  webWidget: jasmine.createSpyObj(
    'webWidget',
    [
      'upShow',
      'upHide',
      'downHide',
      'downShow',
      'close',
      'launcherUpShow',
      'launcherDownHide'
    ])
};

exports.mockTransitionFactory = mockTransitionFactory;
