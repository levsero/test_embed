let globals = require('utility/globals');

test('getZendeskHost returns document.zendeskHost', () => {
  let result;

  document.zendeskHost = 'test.zendesk.com';
  result = globals.getZendeskHost(document);

  expect(result)
    .toEqual('test.zendesk.com');

  document.zendeskHost = null;
});

test('getZendeskHost returns document.webWidget.id', () => {
  let result;

  document.zendesk = {
    web_widget: { id: 'test3.zendesk.com' } }; // eslint-disable-line camelcase
  result = globals.getZendeskHost(document);

  expect(result).toEqual('test3.zendesk.com');

  document.zendesk = null;
});

test('getZendeskHost returns document.web_widget.id', () => {
  let result;

  document.web_widget = { id: 'test2.zendesk.com' }; // eslint-disable-line camelcase
  result = globals.getZendeskHost(document);

  expect(result).toEqual('test2.zendesk.com');

  document.web_widget = null; // eslint-disable-line camelcase
});
