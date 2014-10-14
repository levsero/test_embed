var webdriverio = require('webdriverio');
var webdrivercss = require('webdrivercss');
jasmine.getEnv().defaultTimeoutInterval = 10000;

var capturingData = {
      name: 'submitTicket',
      elem: '#ticketSubmissionForm'
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

describe('submitTicket', function() {
  it('should show empty submit ticket form', function(done) {
    browser
      .waitForExist('#ticketSubmissionLauncher', 2000)
      .frame('ticketSubmissionLauncher')
      .click('.Button--cta')
      .frame(null)
      .waitForVisible('#ticketSubmissionForm')
      .webdrivercss('submitTicket', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should highlight first field green when focused', function(done) {
    browser
      .frame('ticketSubmissionForm')
      .click('.rf-Field input')
      .frame(null)
      .webdrivercss('submitTicket.focus', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should highlight email field red when blurred with invalid value', function(done) {
    browser
      .refresh()
      .waitForExist('#ticketSubmissionLauncher', 2000)
      .frame('ticketSubmissionLauncher')
      .click('.Button--cta')
      .frame(null)
      .frame('ticketSubmissionForm')
      .click('.rf-Field input[type="email"]')
      .click('h2')
      .frame(null)
      .webdrivercss('submitTicket.email.invalid.state', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should change submit button to green when field is valid', function(done) {
    browser
      .refresh()
      .waitForExist('#ticketSubmissionLauncher', 2000)
      .frame('ticketSubmissionLauncher')
      .click('.Button--cta')
      .frame(null)
      .frame('ticketSubmissionForm')
      .setValue('.rf-Field input', 'Ryan')
      .setValue('.rf-Field input[type="email"]', 'ryan@example.com')
      .setValue('.rf-Field textarea', 'Halp!')
      .frame(null)
      .webdrivercss('submitTicket.valid.form', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
