class AddDeletionReminderStatusInAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :deletion_email_reminder, :integer, default: nil
  end
end
