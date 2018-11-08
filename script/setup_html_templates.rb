#!/usr/bin/env ruby
require 'fileutils'

directory = 'dev/templates/web_widget'
example_files = Dir.entries(directory).select { |f| f =~ /example/ }

raise 'Error: Missing webwidget HTML template files' if example_files.empty?

files = example_files.each_with_object({}) do |file, acc|
  acc[file] = file.sub(/.example/, '')
end

files.each do |example, html|
  FileUtils.cp("#{directory}/#{example}", "#{directory}/#{html}")
end
