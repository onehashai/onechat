class Account::AccountDeletionSchedulerJob < ApplicationJob
  queue_as :scheduled_jobs

  def perform
    config_name = 'INITIAL_WARNING_AFTER_DAYS'
    no_days = GlobalConfig.get(config_name)[config_name] || 30
    no_days = no_days.to_i
    intemediatry_config_name = 'INTEMEDIATRY_WARNING'
    intemediatry_days = GlobalConfig.get(intemediatry_config_name)[intemediatry_config_name] || 4
    intemediatry_days = intemediatry_days.to_i

    deletion_days_config_name = 'ACCOUNT_DELETION_DAYS_AFTER_INTEMEDIATRY_WARNING'
    deletion_days = GlobalConfig.get(deletion_days_config_name)[deletion_days_config_name] || 3
    total_no_days = intemediatry_days + no_days + deletion_days.to_i

    Account.all.each do |account|
      subscription = account.account_billing_subscriptions.where(cancelled_at: nil)&.last

      next unless subscription.blank? || subscription.billing_product_price&.unit_amount&.zero?

      users = account.users.where('last_sign_in_at < ? ', total_no_days.days.ago)

      next if users.any?

      user = account.account_users.where(inviter_id: nil).last.user
      next unless user.created_at < no_days.days.ago

      AdministratorNotifications::AccountMailer.account_deletion(account).deliver_now
      account.users.destroy_all
      account.destroy
    end
  end
end
