class Account::UpdateUserAccountsBasedOnLimitsJob < ApplicationJob
  queue_as :default

  def perform(account_id)
    account = Account.find(account_id)
    allowed_no_of_users = account.usage_limits[:agents]
    no_of_user = account.account_users.count
    if allowed_no_of_users.present? and no_of_user > allowed_no_of_users.to_i
      difference = no_of_user - allowed_no_of_users.to_i
      agents_count = account.agents.count
      if difference >= agents_count
        account.agents.each do |agent|
          agent.account_users.update_all(is_deleted: true)
        end
        account.agents.update_all(is_deleted: true)
        delete_admins(account, difference - agents_count)
      else
        delete_agents(account, difference)
      end
    else
      if no_of_user < allowed_no_of_users.to_i
        puts "---------------------------------------------"
        difference = allowed_no_of_users.to_i - no_of_user
        puts "-------------------------#{difference}------------"
        AccountUser.unscoped.where(account_id: account.id, is_deleted: true).limit(difference).each do |account_user|
          puts "----ACID---------------------#{account_user.id}------------"
          User.unscoped.find(account_user.user_id).update!(is_deleted: false)
          account_user.update!(is_deleted: false)

        end
      end
    end
  end

  def delete_admins(account, no_of_users)
    account.account_users.where.not(inviter_id: nil).limit(no_of_users).each do |account_user|
      account_user.update(is_deleted: true)
      account_user.user.update(is_deleted: true)
    end
  end

  def delete_agents(account, no_of_users)
    account.agents.limit(no_of_users).each do |agent|
      agent.update(is_deleted: true)
      agent.account_users.update_all(is_deleted: true)
    end
  end

end
