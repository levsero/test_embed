const mockTransitionFactory = {
  automaticAnswersMobile: jasmine.createSpyObj('automaticAnswersMobile', ['upShow', 'downHide']),
  automaticAnswersDesktop: jasmine.createSpyObj('automaticAnswersDesktop', ['upShow', 'downHide']),
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
