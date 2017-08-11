require 'aws-sdk'

class S3Deployer
  ENCRYPTION_TYPE = 'AES256'.freeze

  def initialize(credentials, bucket_name, logger)
    Aws.config.update(
      region: credentials[:region],
      credentials: credentials[:credentials]
    )
    @bucket_name = bucket_name
    @logger = logger
  end

  def upload_files(local_directory, remote_directory, files)
    put_object("#{remote_directory}/")

    files.each do |file|
      object_key = "#{remote_directory}/#{file}"

      put_object(object_key)
      upload_file(object_key, "#{local_directory}/#{file}")
    end
  end

  def bucket
    @bucket ||= Aws::S3::Resource.new.bucket(bucket_name)
  end

  private

  attr_reader :bucket_name
  attr_reader :logger

  def put_object(key)
    logger.info "put_object #{key} on #{bucket_name}"
    bucket.put_object(key: key, server_side_encryption: ENCRYPTION_TYPE)
  end

  def upload_file(object_key, file)
    logger.info "upload_file #{file} to #{object_key} on #{bucket_name}"
    bucket.object(object_key)
      .upload_file(file, server_side_encryption: ENCRYPTION_TYPE)
  end
end
