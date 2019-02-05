import * as selectors from 'src/redux/modules/base/base-selectors';

const mockState = (config) => ({ base: config });
const mockConfig = (config = {}) => (
  embeddableConfig({
    embeds: {
      talk: config.talk,
      ticketSubmissionForm: config.ticketSubmission
    }
  })
);
const embeddableConfig = (config) => (
  mockState({
    embeddableConfig: config
  })
);

test('getTalkConfig', () => {
  const config = {
    talk: {
      props: {
        color: '#123123',
        serviceUrl: 'https://example.com',
        nickname: 'Support'
      }
    }
  };

  const state = mockConfig(config);

  expect(selectors.getTalkConfig(state))
    .toEqual(config.talk);
});

describe('getFormTitleKey', () => {
  describe('when config contains a setting', () => {
    const config = {
      ticketSubmission: {
        props: {
          formTitleKey: 'contact',
        }
      }
    };

    it('returns the setting', () => {
      const state = mockConfig(config);

      expect(selectors.getFormTitleKey(state))
        .toEqual('contact');
    });
  });

  describe('when config does not contain a setting', () => {
    it('returns the default', () => {
      const state = mockConfig();

      expect(selectors.getFormTitleKey(state))
        .toEqual('message');
    });
  });
});

test('getBrand', () => {
  const config = embeddableConfig({ brand: 'x brand' });

  expect(selectors.getBrand(config))
    .toEqual('x brand');
});

test('getBrandLogoUrl', () => {
  const config = embeddableConfig({ brandLogoUrl: 'logo url' });

  expect(selectors.getBrandLogoUrl(config))
    .toEqual('logo url');
});

test('getAnswerBotEnabled', () => {
  const config = embeddableConfig({
    embeds: {
      helpCenterForm: {
        props: {
          answerBotEnabled: true
        }
      }
    }
  });

  expect(selectors.getAnswerBotEnabled(config))
    .toEqual(true);
});
