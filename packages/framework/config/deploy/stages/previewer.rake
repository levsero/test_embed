require_relative '../deploy_helper'

def release_previewer_assets
  raise version_error(PREVIEWER_DIRECTORY_VERSIONED) unless version_exists_on_s3?(PREVIEWER_DIRECTORY_VERSIONED)

  PREVIEW_FILES.each do |file|
    s3_deployer.copy(
      "#{PREVIEWER_DIRECTORY_VERSIONED}/#{file}",
      "web_widget/previews/#{file}"
    )
  end
end

desc "Release Previewer Assets to the public"
task :previewer do
  release_previewer_assets
end
