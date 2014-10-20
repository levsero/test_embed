var capturingData = {
      name: 'launcher',
      elem: '#ticketSubmissionLauncher'
    },
    browser = webdriverio.remote({
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
      .waitForExist('#ticketSubmissionLauncher', 5000)
      .webdrivercss('inactive.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should change to circle with x inside when active', function(done) {
    browser
      .clickLauncherButton('ticketSubmissionLauncher')
      .waitForVisible('#ticketSubmissionForm')
      .webdrivercss('active.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
