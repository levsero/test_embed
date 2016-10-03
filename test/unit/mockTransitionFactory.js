const mockTransitionFactory = {
  npsMobile: jasmine.createSpyObj('npsMobile', ['upShow', 'downHide']),
  npsDesktop: jasmine.createSpyObj('npsDesktop', ['upShow', 'downHide']),
  ipm: jasmine.createSpyObj('ipm', ['upHide', 'downShow']),
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
      'launcherDownHide'
    ])
};

exports.mockTransitionFactory = mockTransitionFactory;
