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
    json.description '<p><span style="color: #00ff00">&#9745; </span>ABC DEF</p>
                      <p>&#9745;  ABC DEF</p>
                      <p><span style="color: #00ff00">&#10003; </span> ABC DEF</p> <p>&#10003;  ABC DEF</p>'
    json.name product_price.billing_product.product_name
    json.display_name "#{product_price.billing_product.product_name} - #{product_price.unit_amount.to_i / 100} $ / #{product_price.limits['agents'].blank? ? '∞'.html_safe : product_price.limits['agents'] } agent / month"
    json.unit (product_price.unit_amount.to_i / 100).to_s
    json.allowed_no_agents product_price.limits['agents']
    json.chat_history product_price.limits['history']
  end
end
