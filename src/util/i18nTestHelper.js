import { i18n } from 'service/i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const fallbackPath = path.resolve(__dirname, '../../config/locales/translations/embeddable_framework.yml');
const fallbackTranslations = yaml.safeLoad(fs.readFileSync(fallbackPath));

i18n.init(createStore(reducer));
i18n.setFallbackTranslations(fallbackTranslations, true);
i18n.setLocale('en-US');
