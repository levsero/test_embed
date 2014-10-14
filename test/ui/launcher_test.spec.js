var webdriverio = require('webdriverio');
var webdrivercss = require('webdrivercss');
jasmine.getEnv().defaultTimeoutInterval = 10000;

var capturingData = {
      name: 'launcher',
      elem: '#ticketSubmissionLauncher'
    },
    browser;

browser = webdriverio.remote({
  desiredCapabilities: {
    browserName: 'chrome'
  }
});

webdrivercss.init(browser);
browser
  .init()
  .url('http://localhost:1337/example/launcher.html');

describe('launcher', function() {
  it('should show default launcher button', function(done) {
    browser
      .waitForExist('#ticketSubmissionLauncher', 3000)
      .webdrivercss('inactive.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should change to circle with x inside when active', function(done) {
    browser
      .frame('ticketSubmissionLauncher')
      .click('.Button--cta')
      .frame(null)
      .waitForVisible('#ticketSubmissionForm')
      .webdrivercss('active.launcher', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
