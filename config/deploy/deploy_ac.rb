require_relative './s3_deployer'

set :framework_files, ['web_widget.js', 'manifest.json']
set :aws_credentials, nil
set :aws_region, 'us-east-1'
set :s3_release_directory, ''
set :s3_bucket_name, ''

namespace :embeddable_framework do
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
