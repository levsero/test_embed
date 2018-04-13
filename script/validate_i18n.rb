require 'zendesk_i18n_dev_tools'

paths = [File.join(File.expand_path('../config', __dir__), 'locales', 'translations')]
ZendeskI18nDevTools::YamlValidator.validate!(paths, include_rosetta_files: true)
