# 7. Browser Testing Framework

 Date: 2019-05-28

 ## Attendees
- Apoorv Kansal
- Adrian Yong
- Briana Coppard
- Lucas Hills
- Adrian Evans
- David Allen
- Wayne See
- Levi Serebryanski
- Timothy Patullock
- Nick Dawbarn
- Daniel Bradford
- Stefan Vizzari

## Status

In Progress

 ## Context
In light of the recent [API infinite loop bug](https://zendesk.atlassian.net/wiki/spaces/ops/pages/694063407/2019-04-11+Integrated+chat+widget+causing+customer+sites+to+become+unresponsive+Non-SI), the team realised the need and importance extensive API test coverage. It is not enough to have one simple unittest for each api. In order to gain more confidence in deploys (especially deploys related to APIs), we need to test complex API configurations. Some customers have more than 200 lines of our API code triggering off an exponential number of different workflows within the widget.

After much deliberation, the team decided it's necessary to write proper browser tests to test the full sequence of the widget initialization under a number of different API usecases. Although integrations test would be easy to write and provide a decent amount of coverage, it is much more difficult to completely test the full widget initialization process which also includes queuing APIs on page load.

Furthermore, rather than writing more Zendesk Browser Tests, we have decided to move to a testing framework that can be embeded into our repository. The team prefers to write browser tests in one unified repository and our existing staging tests are very flaky due to Help Center account creation failing regularly. For that reason, we have also decided that our new browser tests will have limited dependency on external Zendesk services. The tests will depend on a shared Zendesk account but not interact with it to large extent. 

As such, two Web Widget Engineers (Apoorv Kansal and Adrian Yong) investigated two popular browser testing frameworks. The libraries have been critically evaluated below.

 ## Potential Solutions

 ### [Cypress](https://www.cypress.io/)
Cypress is a complete all-in-one end to end Javascript testing tool that includes a proper testing framework, assertion library, mocking capabilities and more. 
It allows developers to easily write and run tests locally and on our CI providers. Some key differences Cypress has:
- Does not use Selenium.
- Developer first framework.
- Works with many tools and frameworks (eg. React, Angular, Applitools, Percy.io etc.).
- Large and evergrowing community support.
- All in one tool.
- Lightning fast tests.

Cypress code a chain of commands where each command returns a Promise-like instance. It manages a Promise chain on your behalf, with each command yielding a ‘subject’ to the next command, until the chain ends or an error is encountered. The commands are asynchronous and that commands don't do anything the moment they are invoked but rather enqueue themselves to be run later which Cypress manages.

#### Considerations for the Web Widget

##### Web Sockets
Given that we cannot programmatically control Chat or Talk settings, we will need to mock out web socket payloads at the transport layer. Unfortunately, Cypress does not come with web socket mocking out of the box. However, we can easily monkey-patch the `window.WebSocket` class with an adaptor class. This adaptor class will return the original `window.WebSocket` class if the connection is not to a zopim endpoint. In the other case, it will return a wrapped object that has access to the socket listeners. This adaptor class can live inside our cypress code and allow for easy access to the chat web sdk socket listeners where we can send mocked payloads. 

##### HTTP Requests
Given that we do not want to constantly change account settings to produce different web widget configurations, we should mock the `embeddable/config` endpoint to return different enabled products, widget colours or anything else. Cypress comes with [http mocking](https://docs.cypress.io/guides/guides/network-requests.html#Testing-Strategies) out of the box.


##### API queuing 
We need to test complex API usecases and this includes using the `zE(() => {})` and `$zopim(() => {})` embedded onto a html page. Since having a separate html page for each test is unmaintable and not scalable, we should inject Javascript code onto the rendered html before the page loads. Cypress has a `onBeforeLoad` [handler](https://docs.cypress.io/api/commands/visit.html#Arguments) and here, we can inject the callbacks.

##### Running APIs during runtime
Cypress provides [access](https://docs.cypress.io/api/commands/window.html#No-Args) to the window object during test execution, and hence, we can call apis during runtime. 

#### General Considerations
##### Advantages
- Cypress supports making [http requests](https://docs.cypress.io/api/commands/request.html#Syntax) to backend services and mocking http requests.
- All tests run in the browser. This means that Cypress can there is no need for object serialization or JSON wire protocols. We will have full access to the Chrome Developer tools and have access to powerful debugging. 
- Cypress supports [plugins](https://docs.cypress.io/guides/tooling/plugins-guide.html#Use-Cases) that allow us to tap in node based processes if needed.
- Chai-like testing syntax.
- Powerful development environment that makes writing and testing so easy and quick.
- Environment variable support via json files, bash statements and plugins.
- Large community support and actively developed.
- Easy to understand documentation.
- Able to integrate with Kent C Dodd's react testing library for querying and interacting with elements (see: https://github.com/testing-library/cypress-testing-library).
Easy integration on Travis, Jenkins and local environment (requires slightly more configuration given that we do not have an asset composer iframe locally).
- Cypress has support for custom commands that can easily work with the chain of commands. For example, we can easily abstract opening the widget into a simple command to dry up the tests.
- Cypress is like jQuery. Queried elements always return a jQuery object and hence, it allows to easily select items with a common and popular interface.
- Cypress is super simple and easy to read. Even a non-programmer can understand what is happening in the code below:

```
it('send api chat message', () => {
  cy.visit(`${Cypress.env('hostPage')}/live.html`);

  cy.findByText('Live chat')
    .click()
    .findByText('Start chat')
    .click();

  cy.window().then((win) => {
    win.zE('webWidget', 'chat:send', 'I\'d like the Jambalaya, please');
  });

  cy.findByText('I\'d like the Jambalaya, please')
    .should('exist');
});
```

##### Disadvantages
- Cypress support iframes to a limited extent (https://docs.cypress.io/guides/references/known-issues.html#Iframes). Although not all features work at the moment, it is on demand feature request with (see cypress-io/cypress#136). I can see this support being added in the [future too](https://github.com/cypress-io/cypress/issues/685). We have built a [workaround solution](https://github.com/zendesk/embeddable_framework/pull/2950) that is feasible for the team.
- Given that it does not have support for iframes, certain features do not work such as snapshot traversals. This isn't a big deal as it's mainly used for local development work and it's really a nice to have feature more than a critical feature. I do not believe any browsing testing framework provides this feature.
- Only supports all Chrome flavoured browsers.
- Supports only one tab in one browser.


### Puppeteer
Description:
Considerations:
Advantages:
Disadvantages:

 ## Decision


 ## Consequences of Decision

 TBD
