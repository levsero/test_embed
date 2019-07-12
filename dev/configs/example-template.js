module.exports = {
  // The url to your Zendesk domain
  zendeskHost: 'dev.zd-dev.com',

  // Your zopim/chat account id
  // Can be found in the embeddable config under "zopimId" https://subdomain.zendesk-staging.com/embeddable/config
  zopimId: '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',

  // The full url to a Zendesk account that has Talk enabled
  talkIntegration: 'https://talkintegration-pod999.zendesk-staging.com',

  // The nickname for the Talk/Widget configuration you want to use
  // If you haven't already, create a new configuration under "Widget" here https://subdomain.zendesk-staging.com/agent/admin/voice
  // Can also be found in the embeddable config under "nickname" https://subdomain.zendesk-staging.com/embeddable/config
  talkNickname: 'hola',

  // Shared secret for your Support account
  // Can be found by clicking on "configure" for the Security Settings here https://subdomain.zendesk-staging.com/agent/admin/widget
  // You may need to activate the widget in the Help Center first
  sharedSecret: 'abc123',

  // Shared secret used for authenticating chat sessions
  // Can be found here under Visitor Authentication https://subdomain.zendesk.com/chat/agent#widget/widget_security
  // You may need to click "Generate"
  chatSharedSecret: '123abc',

  // Google Analytics id
  gaID: 'UA-103023081-1',

  // This information is used to identify a user using zE.identify
  user: {
    name: 'Alice Bob',
    email: 'alice.bob+12345@zddev.com',

    // Used for generating a Chat JWT token, this can be any value you want
    externalId: '1234'
  }
}
