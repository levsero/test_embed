# frozen_string_literal: true
require_relative './s3_deployer'

VERSION = ENV['REVISION'].freeze
ASSETS_DIR = 'dist/public'.freeze
S3_RELEASE_DIRECTORY_VERSIONED = "web_widget/#{VERSION}".freeze
S3_RELEASE_DIRECTORY_LATEST = 'web_widget/latest'.freeze
PREVIEWER_DIRECTORY_VERSIONED = "web_widget/previews/#{VERSION}".freeze
PREVIEW_FILES = %i(webWidgetPreview.js chatPreview.js).freeze

def s3_deployer
  @s3_deployer ||= S3Deployer.new(ENV['STATIC_ASSETS_AWS_BUCKET_NAME'])
end

def version_exists_on_s3?(path)
  s3_deployer.object_exists?("#{path}/")
end

def version_error(path)
  "Folder #{path} does not exist on the bucket"
end
