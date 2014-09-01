require 'zendesk/deployment'
require 'airbrake/capistrano'

set :application, "embeddable_framework"
set :repository, "git@github.com:zendesk/embeddable_framework"
set :email_notification, ["deploys@zendesk.com",
                          "taipan@zendesk.com",
                          "engagement@zendesk.flowdock.com"]

set(:framework_path) { File.join(deploy_to, 'dist') }

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
    sh "bin/gulp build"

    logger.info "Uploading assets"
    upload "dist/main.js",     "#{framework_path}/main.js", :via => :scp
    upload "dist/update.html", "#{framework_path}/update.html", :via => :scp
  end

end
