require 'aws-sdk'
require 'yaml'
require 'zendesk/deployment'
require 'airbrake/capistrano'

set :application, "zendesk_embeddable_framework"
set :repository, "git@github.com:zendesk/embeddable_framework"
set :ruby_version, File.read(".ruby-version").chomp
set :email_notification, ["deploys@zendesk.com",
                          "taipan@zendesk.com",
                          "engagement@zendesk.flowdock.com"]
set :framework_files,    ["main.js",
                          "npsPreview.js",
                          "webWidgetPreview.js",
                          "web_widget.js",
                          "manifest.json",
                          "update.html",
                          "bootstrap.js"]

set(:framework_deploy_path) { File.join(deploy_to, 'assets', 'embeddable_framework') }
set(:build_version) { (tag && tag.gsub(/^v/, '')) || fetch(:branch, nil) || local_head_revision }

set(:real_revision) { Zendesk::Deployment::Committish.new(revision).sha }

set(:aws_credentials) {
  secrets_file = YAML.load(File.read('/etc/zendesk/zendesk.yml'))
  key = secrets_file['production']['aws_access_key']
  secret = secrets_file['production']['aws_secret_key']
  Aws::Credentials.new(key, secret)
}

set(:aws_region) { 'us-east-1' }

set(:s3_bucket_name) { 'zendesk-embeddable-framework' }
set(:s3_release_directory) { tag ? "releases/#{tag}" : "releases/#{build_version}" }

before 'embeddable_framework:deploy', 'deploy:setup'
before 'embeddable_framework:deploy', 'deploy:verify_local_git_status'
before 'embeddable_framework:deploy', 'embeddable_framework:build_assets'
after  'embeddable_framework:deploy', 'deploy:notify'

before 'embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'
before 'embeddable_framework:release_to_s3', 'embeddable_framework:build_assets'

def sh(command)
  logger.trace "executing locally: #{command.inspect}" if logger
  result = `#{command}`
  abort "COMMAND FAILED #{command}\n#{result}" unless $?.success?
  result
end

namespace :deploy do
  task :verify_local_git_status do
    if local_head_revision != real_revision && !local_head_revision.match(/^#{real_revision}/)
      confirm("You are currently not at #{revision}. Maybe you should run `git checkout #{revision}`")
    end
  end
end

namespace :embeddable_framework do
  task :build_assets do
    logger.info "Building assets"
    sh "npm install"
    sh "node_modules/.bin/bower install"
    sh "script/fetch_i18n"
    sh "npm run build"
  end

  task :release_to_s3 do
    Aws.config.update({
      region: aws_region,
      credentials: aws_credentials
    })

    resource = Aws::S3::Resource.new

    bucket = resource.bucket(s3_bucket_name)

    # clear release directory if exists
    if bucket.object("#{s3_release_directory}/").exists?
      logger.info "#{s3_release_directory} exists - batch deleting"
      bucket.objects({ prefix: "#{s3_release_directory}/" }).batch_delete!
    end

    # upload
    bucket.put_object({key: "#{s3_release_directory}/", server_side_encryption: 'AES256'})

    framework_files.each do |file|
      logger.info "put_object #{s3_release_directory}/#{file}"
      bucket.put_object({key: "#{s3_release_directory}/#{file}", server_side_encryption: 'AES256'})

      logger.info "upload_file dist/#{file}"
      bucket.object("#{s3_release_directory}/#{file}")
            .upload_file("dist/#{file}", {server_side_encryption: 'AES256'})
    end
  end

  task :deploy_from_s3 do
    Aws.config.update({
      region: aws_region,
      credentials: aws_credentials
    })

    resource = Aws::S3::Resource.new
    client = Aws::S3::Client.new

    bucket = resource.bucket(s3_bucket_name)

    logger.info "Checking if #{s3_release_directory}/ exists"

    unless bucket.object("#{s3_release_directory}/").exists?
      logger.info " "
      logger.info "!!!!!   RELEASE '#{s3_release_directory}' NOT FOUND ON S3 YET   !!!!!"
      logger.info " "
      abort
    end

    framework_files.each do |file|
      logger.info "Downloading #{s3_release_directory}/#{file} to dist/#{file}"

      client.get_object(
        response_target: "dist/#{file}",
        bucket: s3_bucket_name,
        key: "#{s3_release_directory}/#{file}"
      )
    end

    logger.info "Uploading assets"
    run "mkdir -p #{framework_deploy_path}/#{build_version}"
    framework_files.each do |file|
      upload "dist/#{file}", "#{framework_deploy_path}/#{build_version}/#{file}", :via => :scp
    end
    find_and_execute_task "embeddable_framework:update_current"
  end

  task :deploy do
    logger.info "Uploading assets"
    run "mkdir -p #{framework_deploy_path}/#{build_version}"
    framework_files.each do |file|
      upload "dist/#{file}", "#{framework_deploy_path}/#{build_version}/#{file}", :via => :scp
    end
    find_and_execute_task "embeddable_framework:update_current"
  end

  desc "Update the 'live' version of embeddable_framework"
  task :update_current do
    logger.info "Updating current framework version"
    begin
      framework_files.each do |file|
        run "test -f #{framework_deploy_path}/#{build_version}/#{file}"
      end
    rescue Capistrano::CommandError
      logger.important "ERROR: One of the target release file does not exist!"
      exit
    end
    run "ln -snf #{framework_deploy_path}/#{build_version} #{framework_deploy_path}/current"
  end

end
