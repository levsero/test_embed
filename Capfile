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

  task :deploy do
    logger.info "Generating assets"
    sh "npm install"
    sh "node_modules/.bin/bower install"
    sh "script/fetch_i18n"
    sh "node_modules/.bin/gulp build"

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
