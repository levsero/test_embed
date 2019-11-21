# frozen_string_literal: true

require 'json'
require 'zlib'
require 'filesize'
require 'dogapi'

module PackageSize
  class Reporter
    STATS_FILE_LOCATION = 'dist/stats.json'

    attr_reader :report_sent

    def initialize(api_key, logger, options)
      @stats_file = File.open(STATS_FILE_LOCATION)
      @options = options
      @logger = logger
      @stats = JSON.load(@stats_file)
      @datadog = Dogapi::Client.new(api_key)
      @report_sent = false
    rescue Errno::ENOENT
      raise ReportError.new 'Build stats file does not exist'
    rescue JSON::ParserError
      raise ReportError.new 'Build stats file is unparseable'
    end

    def packages
      @packages ||= stats['assetsByChunkName']
      .reject { |_name, filename| filename.is_a?(String) }
      .map do |name, filename|
        Package.new(name, filename[0], assets)
      end
    end

    def git_hash
      @git_hash ||= stats['hash']
    end

    def report_to_datadog
      if report_sent
        logger.warn('A report has already taken place for this instance. No need to report again')
        return
      end

      logger.info("Reporting package sizes to Datadog for reference: #{options[:reference]}")

      packages.each do |package|
        report_metric('web_widget.package_size.parsed', package.name, package.size)
        report_metric('web_widget.package_size.gzipped', package.name, package.size(:gzip))
      end
      @report_sent = true
    end

    private

    attr_reader :stats, :logger, :options, :datadog

    def report_metric(metric_name, package_name, value)
      datadog.emit_point(
        metric_name, value,
        tags: {
          hash: git_hash,
          package_name: package_name,
          reference: options[:reference],
          deploy_stage: options[:deploy_stage]
        }
      )
    end

    def assets
      @assets ||= stats['assets']
    end
  end

  class Package
    FILE_DIRECTORY = 'dist/'
    attr_reader :name, :filename, :sizes

    def initialize(name, filename, assets)
      @name = name
      @filename = filename
      @assets = assets
      @sizes = {}
      calculate_sizes
    end

    def size(type = :bytes)
      @sizes[type]
    end

    private

    attr_reader :assets

    def calculate_sizes
      @sizes[:bytes]      ||= assets.find { |asset| asset['name'] == filename }['size']
      @sizes[:human]      ||= Filesize.from(@sizes[:bytes].to_s).pretty
      @sizes[:gzip]       ||= Zlib::Deflate.deflate(File.read(FILE_DIRECTORY + filename)).size
      @sizes[:gzip_human] ||= Filesize.from(@sizes[:gzip].to_s).pretty
    rescue Errno::ENOENT
      raise ReportError.new 'Cannot find build files in specified location'
    end
  end

  class ReportError < StandardError; end
end
