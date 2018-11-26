require 'aws-sdk-s3'
require 'time'

class S3Deployer
  ENCRYPTION_TYPE = 'AES256'.freeze
  SECONDS_IN_A_YEAR = 31536000

  def initialize(credentials, bucket_name, logger)
    Aws.config.update(
      region: credentials[:region],
      credentials: credentials[:credentials]
    )
    @bucket_name = bucket_name
    @logger = logger
  end

  def object_exists?(key)
    bucket.object(key).exists?
  end

  def copy(src, target)
    logger.info "copy #{src} to #{target} on #{bucket_name}"

    bucket.client.copy_object(
      bucket: bucket_name,
      copy_source: bucket_name + '/' + src,
      key: target,
      server_side_encryption: ENCRYPTION_TYPE
    )
  end

  def upload_files(local_directory, remote_directory, files, opts = {})
    put_object("#{remote_directory}/")

    files.each do |file|
      object_key = "#{remote_directory}/#{file}"

      put_object(object_key)
      upload_file(object_key, "#{local_directory}/#{file}", opts)
    end
  end

  def upload_translations(local_directory, remote_directory)
    Dir.glob("#{local_directory}/**/*.js") do |file|
      upload_file("#{remote_directory}/#{file.partition('/').last}", file)

      logger.info "put_object #{file} on dir #{file.partition('/').last}"
    end
  end

  private

  attr_reader :bucket_name, :logger

  def put_object(key)
    return if object_exists?(key)
    logger.info "put_object #{key} on #{bucket_name}"
    bucket.put_object(key: key, server_side_encryption: ENCRYPTION_TYPE)
  end

  def upload_file(object_key, file, opts = {})
    logger.info "upload_file #{file} to #{object_key} on #{bucket_name}"
    bucket.object(object_key)
          .upload_file(
            file,
            {
              server_side_encryption: ENCRYPTION_TYPE,
              cache_control: "public, max-age=#{SECONDS_IN_A_YEAR}",
              expires: expires_header,
              content_type: "#{content_type_header(file)} charset=utf-8"
            }.merge(opts).delete_if { |_, v| v.nil? }
          )
  end

  def expires_header
    (Time.now + SECONDS_IN_A_YEAR).httpdate
  end

  def content_type_header(file)
    extension = File.extname(file)

    if extension == '.js'
      'application/javascript;'
    elsif extension == '.json'
      'application/json;'
    else
      ''
    end
  end

  def bucket
    @bucket ||= Aws::S3::Resource.new.bucket(bucket_name)
  end
end
