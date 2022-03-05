class Enterprise::Billing::HandleStripeEventService
  def call(event:)
    if event['data']['object']['metadata']['website'] == 'OneChat'
      case event.type
      when 'customer.subscription.created'
        subscription = event.data.object
        account = Account.where("custom_attributes->>'stripe_customer_id' = ?", subscription.customer).first
        subscription_price = Enterprise::BillingProductPrice.find_by(price_stripe_id: subscription.plan.id)
        account.account_billing_subscriptions.create!(billing_product_price: subscription_price, subscription_stripe_id: subscription.id,
                                                      current_period_end: Time.at(subscription.current_period_end).utc.to_datetime)
        account.set_limits_for_account subscription_price
      when "customer.subscription.updated"
        subscription = event.data.object
        account = Account.where("custom_attributes->>'stripe_customer_id' = ?", subscription.customer).first
        subscription_price = Enterprise::BillingProductPrice.find_by(price_stripe_id: subscription.plan.id)
        active_subscription = account.account_billing_subscriptions.where(subscription_stripe_id: subscription.id)
        active_subscription.update(current_period_end: Time.at(subscription.current_period_end)) if active_subscription
        account.set_limits_for_account subscription_price
      when "customer.subscription.deleted"
        subscription = event.data.object
        account = Account.where("custom_attributes->>'stripe_customer_id' = ?", subscription.customer).first
        subscription_price = Enterprise::BillingProductPrice.find_by(price_stripe_id: subscription.plan.id)
        active_subscription = account.account_billing_subscriptions.where(subscription_stripe_id: subscription.id)
        active_subscription.update(current_period_end: Time.at(subscription.current_period_end), cancelled_at: Time.current) if active_subscription
        account.set_limits_for_account subscription_price
        else
        Rails.logger.debug { "Unhandled event type: #{event.type}" }
      end
    end
  end
end
