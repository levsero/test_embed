# frozen_string_literal: true

require 'zendesk/deployment'
require 'zendesk/deployment/tasks/environment_selector'

require 'aws-sdk-s3'
require 'yaml'

set :application, 'zendesk_embeddable_framework'
set :repository, 'git@github.com:zendesk/embeddable_framework'
set :ruby_version, File.read('.ruby-version').chomp
set :email_notification, ['deploys@zendesk.com',
                          'taipan@zendesk.com']

set :framework_files, ['webWidgetPreview.js', 'chatPreview.js']

set :branch, ENV['REVISION'] || 'master'

# the old gem gave us `local_head_revision` for free.
# The new one doesn't so we grab it from git
set :local_head_revision, `git rev-parse HEAD 2>&-`.strip
set :build_version,
  (fetch(:tag) && fetch(:tag).gsub(/^v/, '')) || fetch(:branch) || local_head_revision
set :framework_deploy_path, File.join(fetch(:deploy_to), 'assets', 'embeddable_framework')
set :environment, (ENV['RAILS_ENV'] || ENV['RACK_ENV'] || '')
set :rails_env, fetch(:environment)

set :aws_credentials, Aws::Credentials.new(ENV['AWS_RW_ACCESS_KEY'], ENV['AWS_RW_SECRET_KEY'])
set :aws_region, ENV['AWS_REGION'] || 'us-east-1'
set :s3_bucket_name, 'zendesk-embeddable-framework'
set :s3_release_directory, "releases/#{(fetch(:tag) || fetch(:build_version))}"

def sh(command)
  logger.trace "executing locally: #{command.inspect}" if logger
  result = `#{command}`
  abort "COMMAND FAILED #{command}\n#{result}" unless $CHILD_STATUS.success?
  result
end

namespace :embeddable_framework do
  desc 'Build framework assets'
  task :build_assets do
    logger.info 'Building assets'

    sh 'npm set progress=false && npm install'
    sh 'npm run build-previewer'
  end

  desc 'Release to Amazon S3'
  task :release_to_s3 do
    Aws.config.update(
      region: fetch(:aws_region),
      credentials: fetch(:aws_credentials)
    )

    resource = Aws::S3::Resource.new
    bucket = resource.bucket(fetch(:s3_bucket_name))
    s3_release_directory = fetch(:s3_release_directory)

    # clear release directory if exists
    if bucket.object("#{s3_release_directory}/").exists?
      logger.info "#{s3_release_directory} exists - batch deleting"
      bucket.objects(prefix: "#{s3_release_directory}/").batch_delete!
    end

    # upload
    bucket.put_object(key: "#{s3_release_directory}/", server_side_encryption: 'AES256')

    fetch(:framework_files).each do |file|
      logger.info "put_object #{s3_release_directory}/#{file}"
      bucket.put_object(key: "#{s3_release_directory}/#{file}", server_side_encryption: 'AES256')

      logger.info "upload_file dist/#{file}"
      bucket.object("#{s3_release_directory}/#{file}")
        .upload_file("dist/#{file}", server_side_encryption: 'AES256')
    end
  end

  desc 'Deploy from Amazon S3'
  task :deploy_from_s3 do
    Aws.config.update(
      region: fetch(:aws_region),
      credentials: fetch(:aws_credentials)
    )

    resource = Aws::S3::Resource.new
    client = Aws::S3::Client.new
    bucket = resource.bucket(fetch(:s3_bucket_name))
    s3_release_directory = fetch(:s3_release_directory)
    framework_deploy_path = fetch(:framework_deploy_path)

    logger.info "Checking if #{s3_release_directory}/ exists"

    unless bucket.object("#{s3_release_directory}/").exists?
      logger.info ' '
      logger.info "!!!!!   RELEASE '#{s3_release_directory}' NOT FOUND ON S3 YET   !!!!!"
      logger.info ' '
      abort
    end

    fetch(:framework_files).each do |file|
      logger.info "Downloading #{s3_release_directory}/#{file} to dist/#{file}"

      client.get_object(
        response_target: "dist/#{file}",
        bucket: fetch(:s3_bucket_name),
        key: "#{s3_release_directory}/#{file}"
      )
    end

    timestamp = Time.now.strftime('%Y%m%d%H%M.%S')
    logger.info "Uploading assets with timestamp: #{timestamp}"

    on release_roles(:all) do
      execute "mkdir -p #{framework_deploy_path}/#{fetch(:build_version)}"
      fetch(:framework_files).each do |file|
        file_path = "#{framework_deploy_path}/#{fetch(:build_version)}/#{file}"

        upload! "dist/#{file}", file_path
        execute "touch -t #{timestamp} #{file_path}"
      end
    end
  end

  desc 'Deploy to a given stage'
  task :deploy do
    timestamp = Time.now.strftime('%Y%m%d%H%M.%S')
    logger.info "Uploading assets with timestamp: #{timestamp}"
    framework_deploy_path = fetch(:framework_deploy_path)

    on release_roles(:all) do
      execute "mkdir -p #{framework_deploy_path}/#{fetch(:build_version)}"
      fetch(:framework_files).each do |file|
        file_path = "#{framework_deploy_path}/#{fetch(:build_version)}/#{file}"

        upload! "dist/#{file}", file_path
        execute "touch -t #{timestamp} #{file_path}"
      end
    end
  end

  desc "Update the 'live' version of embeddable_framework"
  task :update_current do
    logger.info 'Updating current framework version'
    framework_deploy_path = fetch(:framework_deploy_path)
    begin
      on release_roles(:all) do
        fetch(:framework_files).each do |file|
          execute "test -f #{framework_deploy_path}/#{fetch(:build_version)}/#{file}"
        end
      end
    rescue StandardError => e
      logger.important "ERROR: At least one target release file does not exist!.\nError was #{e}"
      exit
    end

    on release_roles(:all) do
      execute "ln -snf #{framework_deploy_path}/#{fetch(:build_version)} #{framework_deploy_path}/current"
    end
  end
end

namespace :deploy do
  task :verify_local_git_status do
    real_revision = fetch(:real_revision)
    local_head_revision = fetch(:local_head_revision)
    if local_head_revision != real_revision && !local_head_revision.match(/^#{real_revision}/)
      confirm("You are currently not at #{real_revision}. Maybe you should run `git checkout #{real_revision}`")
    end
  end
end

load 'config/deploy/ekr_deploy.rb'

before 'embeddable_framework:deploy', 'deploy:setup'
before 'embeddable_framework:deploy', 'deploy:verify_local_git_status'
before 'embeddable_framework:deploy', 'embeddable_framework:build_assets'
after  'embeddable_framework:deploy', 'deploy:notify'
after  'embeddable_framework:deploy', 'embeddable_framework:update_current'

after  'embeddable_framework:deploy_from_s3', 'embeddable_framework:update_current'

before 'embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'embeddable_framework:release_to_s3', 'embeddable_framework:build_assets'
