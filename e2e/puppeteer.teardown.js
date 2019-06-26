module.exports = async function() {
  // Close the puppeteer browser instance in Jest Test Environment
  await global.__BROWSER_GLOBAL__.close();
};
