class MessageFinder
  def initialize(conversation, params, account = nil)
    @conversation = conversation
    @params = params
    @history_limit = account.present? ? account.usage_limits[:history] : nil
  end

  def perform
    current_messages
  end

  private

  def conversation_messages
    if @history_limit.present?
      messages_after = @history_limit.to_i.days.ago
      @conversation.messages.includes(:attachments, :sender, sender: { avatar_attachment: [:blob] }).where('created_at > ? ', messages_after)
    else
      @conversation.messages.includes(:attachments, :sender, sender: { avatar_attachment: [:blob] })
    end
  end

  def messages
    return conversation_messages if @params[:filter_internal_messages].blank?

    conversation_messages.where.not('private = ? OR message_type = ?', true, 2)
  end

  def current_messages
    if @params[:before].present?
      messages.reorder('created_at desc').where('id < ?', @params[:before]).limit(20).reverse
    else
      messages.reorder('created_at desc').limit(20).reverse
    end
  end
end
