require_relative '../deploy_helper'
require 'jwt'
require 'json'

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

def release_web_widget_assets(group)
  raise version_error(S3_RELEASE_DIRECTORY_VERSIONED) unless version_exists_on_s3?(S3_RELEASE_DIRECTORY_VERSIONED)

  versions = group.nil? ? { version: VERSION } : { versions: { group.to_sym => VERSION }}
  url = "#{ENV['EKR_BASE_URL']}release"
  params = {
    product: {
      name: 'web_widget',
      base_url: ENV['STATIC_ASSETS_DOMAIN'],
      use_asset_manifest: true,
      use_latest: true
    }.merge(versions)
  }.to_json

  sh %(curl -w '%{http_code}' -v -H "Content-Type: application/json" -H "#{ekr_jwt_header}" -X POST -d '#{params}' #{url} | tail -n1 | grep 200)
end

desc "Release Web Widget Assets to the public"
task :release, [:group] do |t, args|
  release_web_widget_assets(args[:group])
end
