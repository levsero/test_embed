import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';

jest.mock('translation/ze_translations');
jest.mock('translation/ze_localeIdMap');

jest.mock('component/Refocus');
jest.mock('src/embed/webWidget/webWidgetStyles');
jest.mock('globalCSS');
