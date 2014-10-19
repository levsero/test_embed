var capturingData = {
      name: 'helpCenter',
      elem: '#helpCenterForm'
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
  .url('http://localhost:1337/example/helpcenter.html');

describe('helpCenter', function() {
  it('should show empty help center search field', function(done) {
    browser
      .openLauncher('hcLauncher')
      .waitForVisible('#helpCenterForm')
      .webdrivercss('helpCenter', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .call(done);
  });

  it('should show no results page when search returns nothing', function(done) {
    browser
      .frame('helpCenterForm')
      .setValue('[type="search"]', 'foobar')
      .submitForm('.Form')
      .waitForVisible('#noResults', 9000)
      .frame(null)
      .webdrivercss('helpCenter.noResults', capturingData, function(err, res) {
        expect(res.misMatchPercentage < 5)
          .toBeTruthy();
      })
      .end(done);
  });
});
