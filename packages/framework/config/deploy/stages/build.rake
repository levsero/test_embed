require_relative '../package_size_reporter'
require_relative '../deploy_helper'

def prepare
  yarn_command 'install'
end

def build_web_widget
  yarn_command 'workspace @zendesk/embeddable-framework build'
end

def yarn_command(command)
  sh "node ../../.yarn/releases/yarn-1.22.10.js #{command}"
end

def report_web_widget
  options = { reference: ENV['REFERENCE'], deploy_stage: ENV['STAGE'] }

  reporter = PackageSize::Reporter.new(
    ENV['DATADOG_API_KEY'], options
  )

  reporter.packages.each do |p|
    puts "Package: #{p.name}. Size: #{p.size} (#{p.size(:human)})"
  end

  reporter.report_to_datadog
end

def upload_web_widget
  default_options = {
    ignore_extensions: ['.map'],
    key_transform: -> (key) { key.gsub('public/', '') }
  }

  s3_deployer.upload_directory(
    ASSETS_DIR,
    S3_RELEASE_DIRECTORY_VERSIONED,
    default_options
  )

  s3_deployer.upload_directory(
    ASSETS_DIR,
    S3_RELEASE_DIRECTORY_LATEST,
    default_options
  )
end

def build_previewer
  yarn_command 'workspace @zendesk/embeddable-framework build-previewer'
end

def upload_previewer
  s3_deployer.upload_files(
    ASSETS_DIR,
    PREVIEWER_DIRECTORY_VERSIONED,
    PREVIEW_FILES,
    {
      cache_control: "public, max-age=600",
      expires: nil # we don't want to send the expires header
    }
  )
  s3_deployer.upload_files(
    'dist/public/locales',
    S3_RELEASE_DIRECTORY_LATEST + '/locales',
    Dir['dist/public/locales/*.js'].map { |f| File.basename(f) }
  )
end

desc "Build and and upload WW/Previewer assets"
task :build do
  prepare

  build_web_widget
  report_web_widget
  upload_web_widget

  build_previewer
  upload_previewer
end
