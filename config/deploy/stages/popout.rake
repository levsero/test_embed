require_relative '../deploy_helper'

def build_and_upload_popout
  sh 'node script/generateNewPopout.js'

  s3_deployer.upload_files(
    ASSETS_DIR,
    S3_RELEASE_DIRECTORY_LATEST,
    ['liveChat.html']
  )
end

desc "Build and and upload Popout assets"
task :popout do
  build_and_upload_popout
end

