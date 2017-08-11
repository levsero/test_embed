require_relative './s3_deployer'

set :version_ac, fetch(:branch) || fetch(:local_head_revision)
set :framework_files_ac, ['web_widget.js', 'manifest.json']
set :aws_credentials_ac, Aws::Credentials.new(ENV['AC_AWS_RW_ACCESS_KEY'], ENV['AC_AWS_RW_SECRET_KEY'])
set :aws_region_ac, 'us-west-2'
set :s3_release_directory_ac, "web_widget/#{fetch(:version_ac)}"
set :s3_bucket_name_ac, 'zendesk-assetcomposer-staging'

namespace :embeddable_framework_ac do
  desc 'Build framework ac assets'
  task :build_assets do
    logger.info 'Building ac assets'

    sh 'npm set progress=false && npm install'
    sh 'script/fetch_i18n'
    sh 'npm run build-ac'
  end

  desc 'Release to Amazon S3 for asset composer'
  task :release_to_s3 do
    credentials = {
      region: fetch(:aws_region_ac),
      credentials: fetch(:aws_credentials_ac)
    }
    bucket_name = fetch(:s3_bucket_name_ac)
    release_directory = fetch(:s3_release_directory_ac)
    files = fetch(:framework_files_ac)

    deployer = S3Deployer.new(credentials, bucket_name, logger)
    deployer.upload_files('dist', release_directory, files)
  end
end

before 'embeddable_framework_ac:release_to_s3', 'deploy:verify_local_git_status'
before 'embeddable_framework_ac:release_to_s3', 'embeddable_framework_ac:build_assets'
