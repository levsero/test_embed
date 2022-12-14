require 'aws-sdk-s3'
require 'time'

class S3Deployer
  ENCRYPTION_TYPE = 'AES256'.freeze
  SECONDS_IN_A_YEAR = 31536000

  EXTENSIONS = {
    '.js' => 'application/javascript',
    '.json' => 'application/json',
    '.html' => 'text/html',
    '.png' => 'image/png',
    '.mp3' => 'audio/mpeg'
  }.freeze

  def initialize(bucket_name)
    @bucket_name = bucket_name
  end

  def object_exists?(key)
    bucket.object(key).exists?
  end

  def copy(src, target)
    puts "copy #{src} to #{target} on #{bucket_name}"

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

  def upload_directory(local_directory, remote_directory, opts = {})
    put_object("#{remote_directory}/")

    Dir.glob("#{local_directory}/*") do |file|
      puts "Inspecting #{file}"
      if opts[:ignore_extensions]
        next if opts[:ignore_extensions].include?(File.extname(file))
      end

      if File.directory? file
        upload_directory(file, remote_directory, opts)
      else
        key = "#{remote_directory}/#{file.partition('/').last}"
        if opts[:key_transform]
          key = opts[:key_transform].call(key)
        end
        upload_file(key, file)
      end
    end
  end

  def upload_file(object_key, file, opts = {})
    puts "upload_file #{file} to #{object_key} on #{bucket_name}"
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

  private

  attr_reader :bucket_name

  def put_object(key)
    return if object_exists?(key)
    puts "put_object #{key} on #{bucket_name}"
    bucket.put_object(key: key, server_side_encryption: ENCRYPTION_TYPE)
  end

  def expires_header
    (Time.now + SECONDS_IN_A_YEAR).httpdate
  end

  def content_type_header(file)
    extension = File.extname(file)
    content_type = EXTENSIONS[extension]

    content_type ? "#{content_type};" : ''
  end

  def bucket
    @bucket ||= Aws::S3::Resource.new.bucket(bucket_name)
  end
end
