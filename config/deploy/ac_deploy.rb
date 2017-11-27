require 'json'
require 'jwt'
require_relative './s3_deployer'

namespace :ac_embeddable_framework do
  set :version, fetch(:branch) || fetch(:local_head_revision)
  set :deploy_files, [
    'web_widget.js',
    'manifest.json',
    'ze_translations.js',
    'ze_localeIdMap.js'
  ]

  set :aws_credentials, Aws::Credentials.new(ENV['WEB_WIDGET_AWS_ACCESS_KEY'], ENV['WEB_WIDGET_AWS_SECRET_KEY'])
  set :aws_region, ENV['STATIC_ASSETS_AWS_REGION']
  set :s3_release_directory, "web_widget/#{fetch(:version)}"
  set :s3_bucket_name, ENV['STATIC_ASSETS_AWS_BUCKET_NAME']
  set :static_assets_domain, ENV['STATIC_ASSETS_DOMAIN']
  set :ekr_base_url, ENV['EKR_BASE_URL']
  set :ekr_jwt_secret, ENV['EKR_RW_JWT_SECRET']

  desc 'Build framework ac assets'
  task :build_assets do
    logger.info 'Building ac assets'

    sh 'npm set progress=false && npm install'
    sh 'npm run validate-manifest'
    sh 'npm run build-ac'
  end

  desc 'Release to Amazon S3 for asset composer'
  task :release_to_s3 do
    credentials = {
      region: fetch(:aws_region),
      credentials: fetch(:aws_credentials)
    }
    bucket_name = fetch(:s3_bucket_name)
    release_directory = fetch(:s3_release_directory)
    files = fetch(:deploy_files)

    deployer = S3Deployer.new(credentials, bucket_name, logger)
    deployer.upload_files('dist', release_directory, files)
  end

  desc 'Release the current version for Staging'
  task :release_to_staging do
    release_to_ekr(:ekr_base_url + 'release')
  end

  desc 'Release the current version for Production'
  task :release_to_production do
    release_to_ekr(:ekr_base_url + 'release')
  end
end

def release_to_ekr(url)
  params = {
    product: {
      name: 'web_widget',
      version: fetch(:version),
      base_url: :static_assets_domain
    }
  }.to_json

  sh %(curl -v -H "Content-Type: application/json" -H #{ekr_jwt_header} -X POST -d '#{params}' #{url})
end

def ekr_jwt_header
  "X-Samson-Token: #{JWT.encode(ekr_jwt_payload, ekr_jwt_secret, 'HS256')}"
end

def ekr_jwt_payload
  now = Time.now.to_i

  {
    exp: now + 60 * 5,
    iat: now,
    user: 'zdsamson'
  }
end

before 'ac_embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:build_assets'
