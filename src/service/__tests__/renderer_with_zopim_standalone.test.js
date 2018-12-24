import 'utility/i18nTestHelper';
import { renderer } from '../renderer';
import { settings } from 'service/settings';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';

jest.mock('service/settings');
jest.mock('src/redux/modules/base');

const store = createStore(reducer);

store.dispatch = jest.fn();

beforeEach(() => {
  settings.get = () => false;
});

test('zopim standalone', () => {
  const configJSON = {
    newChat: false,
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
