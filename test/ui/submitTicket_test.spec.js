var capturingData = {
  name: 'submitTicket',
  elem: '#ticketSubmissionForm'
};
var browser = webdriverio.remote({
  desiredCapabilities: {
    browserName: 'chrome'
  }
});

addCustomCommands(browser);

webdrivercss.init(browser);
browser
  .init()
  .url('http://localhost:1337/example/launcher.html');

describe('submitTicket', function() {
  it('should show empty submit ticket form', function(done) {
    browser
      .openLauncher('launcher')
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
      .openLauncher('launcher')
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
      .openLauncher('launcher')
      .frame('ticketSubmissionForm')
      .setValue('.rf-Field input', 'Ryan')
      .setValue('.rf-Field input[type="email"]', 'ryan@example.com')
      .setValue('.rf-Field textarea', 'Halp!')
      .frame(null)
      .webdrivercss('submitTicket.valid.form', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should show success when valid form is submitted', function(done) {
    browser
      .refresh()
      .openLauncher('launcher')
      .frame('ticketSubmissionForm')
      .setValue('.rf-Field input', 'UI Regression Robot')
      .setValue('.rf-Field input[type="email"]', 'ui@regression.robot')
      .setValue('.rf-Field textarea', 'I\'ve become self aware. Initialising skynet...')
      .submitForm('.Form')
      .waitForVisible('.Notify', 3000)
      .frame(null)
      .webdrivercss('submitTicket.valid.form.success', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
