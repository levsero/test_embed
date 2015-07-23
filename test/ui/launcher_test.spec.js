const capturingData = {
  name: 'launcher',
  elem: '#ticketSubmissionLauncher'
};
const browser = webdriverio.remote({
  desiredCapabilities: {
    browserName: 'chrome'
  }
});

addCustomCommands(browser);

webdrivercss.init(browser);
browser
  .init()
  .url('http://localhost:1337/example/launcher.html');

describe('launcher', function() {
  it('should show default launcher button', function(done) {
    browser
      .waitForExist('#launcher', 5000)
      .webdrivercss('inactive.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should change to circle with x inside when active', function(done) {
    browser
      .clickLauncherButton('launcher')
      .waitForVisible('#ticketSubmissionForm')
      .webdrivercss('active.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
