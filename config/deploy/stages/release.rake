require_relative '../deploy_helper'
require 'jwt'
require 'json'

def version_exists_on_s3?(path)
  s3_deployer.object_exists?("#{path}/")
end

def version_error(path)
  "Folder #{path} does not exist on the bucket"
end

def ekr_jwt_payload
  now = Time.now.to_i

  {
    exp: now + 60 * 5,
    iat: now,
    user: 'zdsamson'
  }
end

def ekr_jwt_header
  "X-Samson-Token: #{JWT.encode(ekr_jwt_payload, ENV['EKR_RW_JWT_SECRET'], 'HS256')}"
end

def release_web_widget_assets
  raise version_error(S3_RELEASE_DIRECTORY_VERSIONED) unless version_exists_on_s3?(S3_RELEASE_DIRECTORY_VERSIONED)

  url = "#{ENV['EKR_BASE_URL']}release"
  params = {
    product: {
      name: 'web_widget',
      version: VERSION,
      base_url: ENV['STATIC_ASSETS_DOMAIN'],
      use_asset_manifest: true,
      use_latest: true
    }
  }.to_json

  sh %(curl -w '%{http_code}' -v -H "Content-Type: application/json" -H "#{ekr_jwt_header}" -X POST -d '#{params}' #{url} | tail -n1 | grep 200)
end

def release_previewer_assets
  raise version_error(PREVIEWER_DIRECTORY_VERSIONED) unless version_exists_on_s3?(PREVIEWER_DIRECTORY_VERSIONED)

  PREVIEW_FILES.each do |file|
    s3_deployer.copy(
      "#{PREVIEWER_DIRECTORY_VERSIONED}/#{file}",
      "web_widget/previews/#{file}"
    )
  end
end

def release
  release_web_widget_assets
  release_previewer_assets
end

desc "Release WW/Previewer assets to the public"
task :release do
  release
end
