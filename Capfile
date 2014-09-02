require 'zendesk/deployment'
require 'airbrake/capistrano'

set :application, "embeddable_framework"
set :repository, "git@github.com:zendesk/embeddable_framework"
set :email_notification, ["deploys@zendesk.com",
                          "taipan@zendesk.com",
                          "engagement@zendesk.flowdock.com"]

set(:assets_path) { File.join(deploy_to, 'assets') }
set(:framework_path) { File.join(assets_path, 'embeddable_framework') }
set(:current_version_path) { File.join(framework_path, 'current') }
set(:build_version) { (tag && tag.gsub(/^v/, '')) || fetch(:branch, nil) || local_head_revision }

set(:real_revision) { Zendesk::Deployment::Committish.new(revision).sha }

before 'embeddable_framework:deploy', 'deploy:verify_local_git_status'
before 'embeddable_framework:update_current', 'deploy:verify_local_git_status'
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
    sh "bower install"
    sh "script/fetch_i18n"
    sh "bin/gulp build"

    logger.info "Uploading assets"
    run "mkdir -p #{framework_path}/#{build_version}"
    upload "dist", "#{framework_path}/#{build_version}", :via => :scp, :recursive => true
  end

  desc "Update the 'live' version of embeddable_framework"
  task :update_current do
    logger.info "Updating current framework version"
    begin
      run "test -f #{framework_path}/#{build_version}/main.js"
      run "test -f #{framework_path}/#{build_version}/update.html"
    rescue Capistrano::CommandError
      logger.important "ERROR: One of the target release file does not exist!"
      exit
    end
    run "ln -snf #{framework_path}/#{build_version} #{current_version_path}"
  end

end
