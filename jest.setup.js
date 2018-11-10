import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';
import { i18n } from 'service/i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';

i18n.init(createStore(reducer));
i18n.setLocale('en-US');

jest.mock('translation/ze_translations');
jest.mock('translation/ze_localeIdMap');

jest.mock('component/Refocus');
jest.mock('src/embed/webWidget/webWidgetStyles');
jest.mock('globalCSS');
jest.mock('vendor/rollbar.umd.min.js', () => {
  const errorSpy = jest.fn();

  return {
    init: jest.fn(() => ({ error: errorSpy })),
    errorSpy
  };
});
