# frozen_string_literal: true

require 'pathname'

module ChatwootApp
  def self.root
    Pathname.new(File.expand_path('..', __dir__))
  end

  def self.max_limit
    100_000
  end

  def self.enterprise?
    return if ENV.fetch('DISABLE_ENTERPRISE', false)

    @enterprise ||= root.join('enterprise').exist?
  end

  def self.chatwoot_saas?
    true
  end

  def self.custom?
    @custom ||= root.join('custom').exist?
  end

  def self.extensions
    if custom?
      %w[enterprise custom]
    elsif enterprise?
      %w[enterprise]
    else
      %w[]
    end
  end

  def self.trial_ending_time
    15.days.from_now
  end

  def self.free_plan_ending_time
    15.years.from_now
  end
end
