require 'json'
require 'jwt'
require_relative './s3_deployer'
require_relative './package_size_reporter'

set :version, fetch(:branch) || fetch(:local_head_revision)
set :ekr_s3_release_directory_versioned, "web_widget/#{fetch(:version)}"
set :ekr_s3_release_directory_latest, 'web_widget/latest'
set :ekr_s3_bucket_name, ENV['STATIC_ASSETS_AWS_BUCKET_NAME']
set :static_assets_domain, ENV['STATIC_ASSETS_DOMAIN']
set :ekr_base_url, ENV['EKR_BASE_URL']
set :ekr_jwt_secret, ENV['EKR_RW_JWT_SECRET']
set :datadog_api_key, ENV['DATADOG_API_KEY']
set :deploy_stage, ENV['STAGE']
set :reference, ENV['REFERENCE']
set :previewer_directory, 'web_widget/previews'
set :previewer_directory_versioned, "web_widget/previews/#{fetch(:version)}"
set :popout_file_name, 'liveChat.html'
set :preview_files, %i(webWidgetPreview.js chatPreview.js)
set :assets_dir, 'dist/public'
set :static_files,
  'src/asset/images/flags.png' => 'web_widget/static/flags.png',
  'src/asset/media/chat-incoming-message-notification.mp3' => 'web_widget/static/chat-incoming-message-notification.mp3'

PREVIEW_EXPIRY = 600

namespace :ac_embeddable_framework do
  desc 'Install needed dependencies'
  task :prepare_assets do
    logger.info 'Building ac assets'

    sh 'npm set progress=false && npm ci'
    sh 'npm dedupe'
  end

  desc 'Reports package sizes to Datadog'
  task :report_package_size do
    options = { reference: fetch(:reference), deploy_stage: fetch(:deploy_stage) }

    reporter = PackageSize::Reporter.new(
      fetch(:datadog_api_key), logger, options
    )

    reporter.packages.each do |p|
      logger.info "Package: #{p.name}. Size: #{p.size} (#{p.size(:human)})"
    end

    reporter.report_to_datadog
  end

  desc 'Upload previewer assets to Amazon S3'
  task :upload_preview_assets_to_s3 do
    sh 'npm run build-previewer'
    s3_deployer.upload_files(
      'dist/public', # local folder to look for files
      fetch(:previewer_directory_versioned), # path on S3 where the files will be stored
      fetch(:preview_files), # preview files to upload
      {
        cache_control: "public, max-age=#{PREVIEW_EXPIRY}",
        expires: nil # we don't want to send the expires header
      } # headers to attach to uploaded S3 objects
    )
  end

  desc 'Upload assets to Amazon S3'
  task :release_to_s3 do
    sh 'npm run build'

    default_options = {
      ignore_extensions: ['.map'],
      key_transform: -> (key) { key.gsub('public/', '') }
    }

    s3_deployer.upload_directory(
      fetch(:assets_dir),
      fetch(:ekr_s3_release_directory_versioned),
      default_options
    )

    s3_deployer.upload_directory(
      fetch(:assets_dir),
      fetch(:ekr_s3_release_directory_latest),
      default_options
    )
  end

  desc 'Upload popout assets to S3'
  task :upload_popout do
    `node script/generateNewPopout.js`
    s3_deployer.upload_files(
      fetch(:popout_file_location),
      fetch(:ekr_s3_release_directory_latest),
      [fetch(:popout_file_name)]
    )
  end

  desc 'Release the current version to EKR'
  task :release_to_ekr do
    path = fetch(:ekr_s3_release_directory_versioned)
    raise version_error(path) unless version_exists_on_s3?(path)

    release_to_ekr
  end

  desc 'Update the previewer assets to latest version'
  task :update_preview_assets_to_latest do
    path = fetch(:previewer_directory_versioned)
    raise version_error(path) unless version_exists_on_s3?(path)

    fetch(:preview_files).each do |file|
      s3_deployer.copy(
        "#{fetch(:previewer_directory_versioned)}/#{file}",
        "#{fetch(:previewer_directory)}/#{file}"
      )
    end
  end
end

def release_to_ekr
  url = "#{fetch(:ekr_base_url)}release"
  params = {
    product: {
      name: 'web_widget',
      version: fetch(:version),
      base_url: fetch(:static_assets_domain),
      use_asset_manifest: true,
      use_latest: true
    }
  }.to_json

  sh %(curl -w '%{http_code}' -v -H "Content-Type: application/json" -H "#{ekr_jwt_header}" -X POST -d '#{params}' #{url} | tail -n1 | grep 200)
end

def ekr_jwt_header
  "X-Samson-Token: #{JWT.encode(ekr_jwt_payload, fetch(:ekr_jwt_secret), 'HS256')}"
end

def ekr_jwt_payload
  now = Time.now.to_i

  {
    exp: now + 60 * 5,
    iat: now,
    user: 'zdsamson'
  }
end

def version_exists_on_s3?(path)
  s3_deployer.object_exists?("#{path}/")
end

def version_error(path)
  "Folder #{path} does not exist on the bucket"
end

def s3_deployer
  bucket_name = fetch(:ekr_s3_bucket_name)

  @s3_deployer ||= S3Deployer.new(bucket_name, logger)
end

before 'ac_embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:prepare_assets'
after 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:report_package_size'
after 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:upload_preview_assets_to_s3'
after 'ac_embeddable_framework:release_to_ekr', 'ac_embeddable_framework:update_preview_assets_to_latest'
