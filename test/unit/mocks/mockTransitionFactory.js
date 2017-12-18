const mockTransitionFactory = {
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
      'launcherDownHide',
      'launcherUpHide',
      'launcherDownShow'
    ])
};

exports.mockTransitionFactory = mockTransitionFactory;
