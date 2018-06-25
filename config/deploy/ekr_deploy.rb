require 'json'
require 'jwt'
require_relative './s3_deployer'

set :version, fetch(:branch) || fetch(:local_head_revision)
set :deploy_files, [
  'web_widget.js',
  'manifest.json',
  'ze_translations.js',
  'ze_localeIdMap.js',
  'ze_countries.js'
]

set :ekr_aws_credentials, Aws::Credentials.new(ENV['WEB_WIDGET_AWS_ACCESS_KEY'], ENV['WEB_WIDGET_AWS_SECRET_KEY'])
set :ekr_aws_region, ENV['STATIC_ASSETS_AWS_REGION']
set :ekr_s3_release_directory_versioned, "web_widget/#{fetch(:version)}"
set :ekr_s3_release_directory_latest, 'web_widget/latest'
set :ekr_s3_bucket_name, ENV['STATIC_ASSETS_AWS_BUCKET_NAME']
set :static_assets_domain, ENV['STATIC_ASSETS_DOMAIN']
set :ekr_base_url, ENV['EKR_BASE_URL']
set :ekr_jwt_secret, ENV['EKR_RW_JWT_SECRET']
set :chat_sdk_version, '9.0.0'
set :chat_sdk_remote_dir, "web_widget/externals/chat-web-sdk/#{fetch(:chat_sdk_version)}"

namespace :ac_embeddable_framework do
  desc 'Build framework ac assets'
  task :build_assets do
    logger.info 'Building ac assets'

    sh 'npm set progress=false && npm install'
    sh 'npm run validate-manifest'
    sh 'npm run build-ac'
  end

  desc 'Release to Amazon S3 for asset composer'
  task :release_to_s3 do
    release_directory_versioned = fetch(:ekr_s3_release_directory_versioned)
    files = fetch(:deploy_files)

    s3_deployer.upload_files('dist', release_directory_versioned, files)
    s3_deployer.upload_files('dist', fetch(:ekr_s3_release_directory_latest), files)

    # Temporary fix to get the newest, non public version of the chat SDK
    # into asset composer. This will be removed when we re-engineer the way
    # we deal with internal and external assets.
    s3_deployer.upload_files(
      'dist',
      fetch(:chat_sdk_remote_dir),
      ['web_sdk.js']
    )

    s3_deployer.upload_translations('dist/locales', release_directory_versioned);
  end

  desc 'Release vendored assets to Amazon S3 for asset composer'
  task :release_chunks_to_s3 do
    release_directory_versioned = fetch(:ekr_s3_release_directory_versioned)

    vendored_assets = JSON.parse(File.read('dist/asset_manifest.json'))['assets']
    vendored_assets = ['asset_manifest.json'] + vendored_assets
    s3_deployer.upload_files('dist', release_directory_versioned, vendored_assets)
    s3_deployer.upload_files('dist', fetch(:ekr_s3_release_directory_latest), vendored_assets)
  end

  desc 'Release the current version to EKR'
  task :release_to_ekr do
    raise version_error unless version_exists_on_s3?

    release_to_ekr
  end
end

def release_to_ekr
  url = "#{fetch(:ekr_base_url)}release"
  params = {
    product: {
      name: 'web_widget',
      version: fetch(:version),
      base_url: fetch(:static_assets_domain)
    }
  }.to_json

  sh %(curl -v -H "Content-Type: application/json" -H "#{ekr_jwt_header}" -X POST -d '#{params}' #{url})
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

def version_exists_on_s3?
  s3_deployer.object_exists?("#{fetch(:ekr_s3_release_directory_versioned)}/")
end

def version_error
  "Folder #{fetch(:ekr_s3_release_directory_versioned)} does not exist on the bucket"
end

def s3_deployer
  credentials = {
    region: fetch(:ekr_aws_region),
    credentials: fetch(:ekr_aws_credentials)
  }
  bucket_name = fetch(:ekr_s3_bucket_name)

  @s3_deployer ||= S3Deployer.new(credentials, bucket_name, logger)
end

before 'ac_embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:build_assets'
before 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:release_chunks_to_s3'
