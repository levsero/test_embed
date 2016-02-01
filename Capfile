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
                          "update.html",
                          "bootstrap.js"]

set(:framework_deploy_path) { File.join(deploy_to, 'assets', 'embeddable_framework') }
set(:build_version) { (tag && tag.gsub(/^v/, '')) || fetch(:branch, nil) || local_head_revision }

set(:real_revision) { Zendesk::Deployment::Committish.new(revision).sha }

before 'embeddable_framework:deploy', 'deploy:setup'
before 'embeddable_framework:deploy', 'deploy:verify_local_git_status'
after  'embeddable_framework:deploy', 'deploy:notify'

before 'embeddable_framework:release_to_s3', 'deploy:setup'
before 'embeddable_framework:release_to_s3', 'deploy:verify_local_git_status'

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
  task :release_to_s3 do
    logger.info "Building assets"
    sh "npm install"
    sh "node_modules/.bin/bower install"
    sh "script/fetch_i18n"
    sh "npm run build"

    secrets_file = YAML.load(File.read('/etc/zendesk/zendesk.yml'))
    key = secrets_file['production']['aws_access_key']
    secret = secrets_file['production']['aws_secret_key']

    bucket_name = 'zendesk-embeddable-framework'

    if tag
      release_directory = "releases/#{tag}"
    else
      release_directory = "releases/#{build_version}"
    end

    Aws.config.update({
      region: 'us-east-1',
      credentials: Aws::Credentials.new(key, secret)
    })

    res = Aws::S3::Resource.new

    bucket = res.bucket(bucket_name)

    # clear release directory
    logger.info "#{release_directory} exists?"

    if bucket.object("#{release_directory}/").exists?
      logger.info "#{release_directory} exists - batch deleting"
      bucket.objects({ prefix: "#{release_directory}/" }).batch_delete!
    end

    # upload
    bucket.put_object({key: "#{release_directory}/", acl: 'public-read'})

    framework_files.each do |file|
      logger.info "put_object #{release_directory}/#{file}"
      bucket.put_object({key: "#{release_directory}/#{file}", acl: 'public-read'})

      logger.info "upload_file dist/#{file}"
      bucket.object("#{release_directory}/#{file}").upload_file("dist/#{file}", {acl: 'public-read'})
    end
  end

  task :deploy do
    logger.info "Generating assets"
    sh "npm install"
    sh "node_modules/.bin/bower install"
    sh "script/fetch_i18n"
    sh "npm run build"

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
