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
        # account.set_limits_for_account subscription_price
      when 'customer.subscription.updated'
        subscription = event.data.object
        account = Account.where("custom_attributes->>'stripe_customer_id' = ?", subscription.customer).first
        subscription_price = Enterprise::BillingProductPrice.find_by(price_stripe_id: subscription.plan.id)
        active_subscription = account.account_billing_subscriptions.where(subscription_stripe_id: subscription.id)&.last
        active_subscription&.update(current_period_end: Time.zone.at(subscription.current_period_end), billing_product_price_id: subscription_price.id)
        # account.set_limits_for_account subscription_price
      when 'customer.subscription.deleted'
        subscription = event.data.object
        account = Account.where("custom_attributes->>'stripe_customer_id' = ?", subscription.customer).first
        subscription_price = Enterprise::BillingProductPrice.find_by(price_stripe_id: subscription.plan.id)
        active_subscription = account.account_billing_subscriptions.where(subscription_stripe_id: subscription.id)&.last
        active_subscription&.update(current_period_end: Time.zone.at(subscription.ended_at), cancelled_at: Time.current)
        account_billing_subscription = account.account_billing_subscriptions.where(cancelled_at: nil)&.last
        if account_billing_subscription.present?
          free_plan = Enterprise::BillingProduct.find_by(product_name: 'Free')
          plan_price = free_plan.billing_product_prices.last
          account_billing_subscription&.update(current_period_end: Time.zone.at(subscription.current_period_end), billing_product_price_id: plan_price.id)
        else
          account.subscribe_for_plan('Free')
        end
        # account.set_limits_for_account subscription_price
      else
        Rails.logger.debug { "Unhandled event type: #{event.type}" }
      end
    end

    return unless event['data']['object']['metadata']['product'] == 'OneChat'

    case event.type
    when 'product.created', 'product.updated', 'product.deleted'
      Enterprise::Billing::SyncStripeProductsService.perform
    when 'plan.created', 'plan.updated', 'plan.deleted'
      Enterprise::Billing::SyncStripeProductsService.perform
    else
      Rails.logger.debug { "Unhandled event type: #{event.type}" }
    end
  rescue StandardError => e
    Rails.logger.debug { "Unhandled event type: #{event.type}" }
    Rails.logger.debug { "Error Message: #{e.message}" }
  end
end
