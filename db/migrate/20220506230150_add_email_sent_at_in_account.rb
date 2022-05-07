class AddEmailSentAtInAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :email_sent_at, :datetime
  end
end
