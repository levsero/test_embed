import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';
import { i18n } from 'service/i18n';

i18n.setLocale('en-US');

jest.mock('translation/ze_translations');
jest.mock('translation/ze_localeIdMap');

jest.mock('component/Refocus');
