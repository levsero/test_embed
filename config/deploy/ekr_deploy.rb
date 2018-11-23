require 'json'
require 'jwt'
require_relative './s3_deployer'

set :version, fetch(:branch) || fetch(:local_head_revision)
set :ekr_aws_credentials, Aws::Credentials.new(ENV['WEB_WIDGET_AWS_ACCESS_KEY'], ENV['WEB_WIDGET_AWS_SECRET_KEY'])
set :ekr_aws_region, ENV['STATIC_ASSETS_AWS_REGION']
set :ekr_s3_release_directory_versioned, "web_widget/#{fetch(:version)}"
set :ekr_s3_release_directory_latest, 'web_widget/latest'
set :ekr_s3_bucket_name, ENV['STATIC_ASSETS_AWS_BUCKET_NAME']
set :static_assets_domain, ENV['STATIC_ASSETS_DOMAIN']
set :ekr_base_url, ENV['EKR_BASE_URL']
set :ekr_jwt_secret, ENV['EKR_RW_JWT_SECRET']
set :previewer_directory, 'web_widget/previews'
set :popout_file_location, 'src/asset/templates/'
set :popout_file_name, 'popout.html'

PREVIEW_EXPIRY = 600

namespace :ac_embeddable_framework do
  desc 'Build framework ac assets'
  task :build_assets do
    logger.info 'Building ac assets'

    sh 'npm set progress=false && npm install'
    sh 'npm dedupe'
    sh 'npm run build'
    sh 'npm run build:previewer'
  end

  desc 'Upload previewer assets to Amazon S3'
  task :upload_preview_assets_to_s3 do
    s3_deployer.upload_files(
      'dist', # local folder to look for files
      fetch(:previewer_directory), # path on S3 where the files will be stored
      %w(webWidgetPreview.js chatPreview.js), # preview files to upload
      {
        cache_control: "public, max-age=#{PREVIEW_EXPIRY}",
        expires: nil # we don't want to send the expires header
      } # headers to attach to uploaded S3 objects
    )
  end

  desc 'Release vendored assets to Amazon S3 for asset composer'
  task :release_to_s3 do
    release_directory_versioned = fetch(:ekr_s3_release_directory_versioned)

    vendored_assets = JSON.parse(File.read('dist/asset_manifest.json'))['assets'].map { |asset| asset['path'] }
    vendored_assets = ['asset_manifest.json'] + vendored_assets
    s3_deployer.upload_files('dist', release_directory_versioned, vendored_assets)
    s3_deployer.upload_files('dist', fetch(:ekr_s3_release_directory_latest), vendored_assets)
    s3_deployer.upload_files(fetch(:popout_file_location),
      fetch(:ekr_s3_release_directory_latest),
      [fetch(:popout_file_name)])
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
      base_url: fetch(:static_assets_domain),
      use_asset_manifest: true,
      use_latest: true
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
after 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:upload_preview_assets_to_s3'
