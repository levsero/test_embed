require_relative './s3_deployer'

set :version, fetch(:branch) || fetch(:local_head_revision)
set :ac_framework_files, ['web_widget.js', 'manifest.json']
set :ac_aws_credentials, Aws::Credentials.new(ENV['AC_AWS_RW_ACCESS_KEY'], ENV['AC_AWS_RW_SECRET_KEY'])
set :ac_aws_region, ENV['AC_AWS_REGION']
set :ac_s3_release_directory, "web_widget/#{fetch(:version)}"
set :ac_s3_bucket_name, ENV['AC_AWS_BUCKET_NAME']

namespace :ac_embeddable_framework do
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
      region: fetch(:ac_aws_region),
      credentials: fetch(:ac_aws_credentials)
    }
    bucket_name = fetch(:ac_s3_bucket_name)
    release_directory = fetch(:ac_s3_release_directory)
    files = fetch(:ac_framework_files)

    deployer = S3Deployer.new(credentials, bucket_name, logger)
    deployer.upload_files('dist', release_directory, files)
  end
end

before 'ac_embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'ac_embeddable_framework:release_to_s3', 'ac_embeddable_framework:build_assets'
