import { i18n } from 'service/i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';

i18n.init(createStore(reducer));
i18n.setLocale('en-US');
