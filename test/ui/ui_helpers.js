(function(){
  jasmine.getEnv().defaultTimeoutInterval = 10000;
}());

function addCustomCommands(browser, launcherID) {
  browser
    .addCommand('clickLauncherButton', function(launcherID, cb) {
      this.frame(launcherID, function() {
        this.click('.Button--cta', function() {
          this.frame(null, function() {
            cb();
          });
        });
      });
    })

    .addCommand('openLauncher', function(launcherID, cb) {
      this.waitForExist('#' + launcherID, 5000, false, function() {
        this.clickLauncherButton(launcherID, function() {
          cb();
        });
      });
    });
}


module.exports = {
  webdriverio: require('webdriverio'),
  webdrivercss: require('webdrivercss'),
  addCustomCommands: addCustomCommands
};

