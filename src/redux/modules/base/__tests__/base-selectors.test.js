import * as selectors from 'src/redux/modules/base/base-selectors';

const mockState = (config) => ({ base: config });
const talkConfig = (config) => (
  mockState({
    embeddableConfig: {
      embeds: {
        talk: config
      }
    }
  })
);

test('getTalkConfig', () => {
  const config = {
    props: {
      color: '#123123',
      serviceUrl: 'https://example.com',
      nickname: 'Support'
    }
  };
  const state = talkConfig(config);

  expect(selectors.getTalkConfig(state))
    .toEqual(config);
});
