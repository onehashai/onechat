class AddIsDeletedInUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :is_deleted, :boolean, default: false
    add_column :account_users, :is_deleted, :boolean, default: false
  end
end
