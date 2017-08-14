require_relative './s3_deployer'

set :version, fetch(:branch) || fetch(:local_head_revision)
set :framework_files, ['web_widget.js', 'manifest.json']
set :aws_credentials, Aws::Credentials.new(ENV['AC_AWS_RW_ACCESS_KEY'], ENV['AC_AWS_RW_SECRET_KEY'])
set :aws_region, ENV['AC_AWS_REGION']
set :s3_release_directory, "web_widget/#{fetch(:version)}"
set :s3_bucket_name, ENV['AC_AWS_BUCKET_NAME']

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
      region: fetch(:aws_region),
      credentials: fetch(:aws_credentials)
    }
    bucket_name = fetch(:s3_bucket_name)
    release_directory = fetch(:s3_release_directory)
    files = fetch(:framework_files)

    deployer = S3Deployer.new(credentials, bucket_name, logger)
    deployer.upload_files('dist', release_directory, files)
  end
end

before 'embeddable_framework_ac:release_to_s3', 'deploy:verify_local_git_status'
before 'embeddable_framework_ac:release_to_s3', 'embeddable_framework_ac:build_assets'
