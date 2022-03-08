json.id @account.id
if @billing_subscription&.billing_product_price.present?
  json.plan_name @billing_subscription.billing_product_price.billing_product.product_name.capitalize
  json.plan_id @billing_subscription.billing_product_price.id
  json.allowed_no_agents @billing_subscription.billing_product_price.limits['agents']
  json.chat_history @billing_subscription.billing_product_price.limits['history']
end
json.agent_count @account.account_users.count
json.available_product_prices do
  json.array! @available_product_prices.each do |product_price|
    json.id product_price.id
    json.description "<p> #{product_price.limits['agents'].presence || '∞ '.html_safe} Agents</p>
                      <p> #{product_price.limits['history'].presence || '∞ '.html_safe} History</p>
                      <p> #{product_price.limits['contacts'].presence || '∞ '.html_safe} Contacts</p>
                      <p> #{product_price.limits['inboxes'].presence || '∞ '.html_safe} Inboxes</p>"
    json.name product_price.billing_product.product_name
    json.display_name "#{product_price.billing_product.product_name} - #{product_price.unit_amount.to_i / 100} $ / #{product_price.limits['agents'].presence || '∞'.html_safe} agent / month"
    json.unit (product_price.unit_amount.to_i / 100).to_s
    json.allowed_no_agents product_price.limits['agents']
    json.chat_history product_price.limits['history']
  end
end
