require 'yaml'
require 'uri'
require 'net/http'
require 'json'

require 'zendesk/cldr/countries/country'
require 'zendesk/cldr/countries/zendesk_mapping'

def load_mapping
  Hash[*Zendesk::Cldr::CountryMapping.map { |id, code| [code, id] }.flatten]
end

def load_config
  YAML.load_file(File.join(File.expand_path('../config', __dir__), 'countries', 'data.yml'))
end

def load_official_language_mapping
  uri = URI.parse('https://raw.githubusercontent.com/unicode-cldr/cldr-core/master/supplemental/territoryInfo.json')
  response = Net::HTTP.get_response(uri)
  countries = JSON.parse(response.body)['supplemental']['territoryInfo']
  mapping = {}
  countries.each do |code, data|
    langs = data['languagePopulation']
    next unless langs
    official_lang = langs.select { |_, lang_data| lang_data['_officialStatus'] == 'official' }
      .sort_by { |_, lang_data| -lang_data['_populationPercent'].to_f }.first
    mapping[code] = official_lang[0] if official_lang
  end
  mapping
end

config = load_config
mapping = load_mapping
official_lang_mapping = load_official_language_mapping
default = Zendesk::Cldr::Country.new('en')

output = config.map do |cc, data|
  country = if data['default_locale']
              Zendesk::Cldr::Country.new(data['default_locale'])
            else
              official_language = official_lang_mapping[cc]
              if official_language == 'en' || official_language.nil?
                default
              else
                Zendesk::Cldr::Country.new(official_language)
              end
            end
  translated = country.single(mapping[cc])
  english = default.single(mapping[cc])
  name = english
  name += " (#{translated})" if translated != english
  [cc, { code: data['code'].to_s, name: name }]
end.sort_by { |k, _| k }

last = output.last[0]

puts <<-INSTR
  Copy the lines below and paste it into src/component/talk/talkCountries.js inside
  the countriesByIso object.
INSTR
puts

output.each do |cc, data|
  line = "  '#{cc}':  { code: '#{data[:code]}', name: '#{data[:name]}' }"
  line += ',' if cc != last
  puts line
end
