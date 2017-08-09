class S3Deployer
  ENCRYPTION_TYPE = 'AES265'.freeze

  def initalize(credentials, bucket_name, logger)
    Aws.config.update(credentials[:region], credentials[:credentials])
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
    logger.info "put_object #{key}"
    bucket.put_object(key: key, server_side_encryption: ENCRYPTION_TYPE)
  end

  def upload_file(object_key, file)
    logger.info "upload_file #{file}"
    bucket.object(object_key)
      .upload_file(file, server_side_encryption: ENCRYPTION_TYPE)
  end
end
