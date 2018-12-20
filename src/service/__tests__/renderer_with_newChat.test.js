import 'utility/i18nTestHelper';
import { renderer } from '../renderer';
import _ from 'lodash';
import { settings } from 'service/settings';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';

jest.mock('service/settings');
jest.mock('src/redux/modules/base');

const store = createStore(reducer);
let mockSettings;

store.dispatch = jest.fn();

beforeEach(() => {
  mockSettings = {
    contactOptions: { enabled: false }
  };
  settings.get = (value) => _.get(mockSettings, value, null);
});

test('new chat', () => {
  const configJSON = {
    newChat: true,
    embeds: {
      'zopimChat': {
        'embed': 'chat',
        'props': {
          'zopimId': '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
          'position': 'br',
          'standalone': true
        }
      }
    }
  };

  renderer.init(configJSON, store);

  expect(document.body.innerHTML)
    .toMatchSnapshot();
});
