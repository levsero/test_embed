import { i18n } from 'service/i18n';
import { createStore } from 'redux';
import reducer from 'src/redux/modules/reducer';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

i18n.init(createStore(reducer));

// Load fallback translations for tests
const oldVal = global.__DEV__;
const fallbackPath = path.resolve(__dirname, '../../config/locales/translations/embeddable_framework.yml');
const fallbackTranslations = yaml.safeLoad(fs.readFileSync(fallbackPath));

global.__DEV__ = true;
i18n.setFallbackTranslations(fallbackTranslations);
global.__DEV__ = oldVal;

i18n.setLocale('en-US');
