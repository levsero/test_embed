require 'zendesk/deployment'
require 'airbrake/capistrano'

set :application, "engagement_framework"
set :repository, "git@github.com:zendesk/engagement_framework"
set :email_notification, ["deploys@zendesk.com"]

set(:assets_path) { File.join(deploy_to, 'assets') }
set(:framework_path) { File.join(assets_path, 'framework') }
set(:current_version_path) { File.join(framework_path, 'current') }
set(:build_version) { (tag && tag.gsub(/^v/, '')) || fetch(:branch, nil) || local_head_revision }

set(:real_revision) { Zendesk::Deployment::Committish.new(revision).sha }

before 'engagement_framework:deploy', 'deploy:verify_local_git_status'
before 'engagement_framework:update_current', 'deploy:verify_local_git_status'
after  'engagement_framework:deploy', 'deploy:notify'

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

namespace :engagement_framework do

  task :deploy do
    logger.info "Generating assets"
    sh "sed -i -e 's/0.1.0/#{build_version}.0.0/' package.json"
    sh "npm install"
    sh "bower install"
    sh "bin/gulp build"

    logger.info "Uploading assets"
    run "mkdir -p #{deploy_to}/assets/framework/#{build_version}"
    upload "dist/#{build_version}/framework.js",     "#{framework_path}/#{build_version}/framework.js", :via => :scp
    upload "dist/#{build_version}/framework.min.js", "#{framework_path}/#{build_version}/framework.min.js", :via => :scp
    upload "dist/#{build_version}/framework.min.map", "#{framework_path}/#{build_version}/framework.min.map", :via => :scp
  end

end
